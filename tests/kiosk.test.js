const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

if (!scriptMatch) {
  throw new Error('Could not find the kiosk application script in index.html');
}

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  toggle(name, force) {
    if (force) this.values.add(name);
    else this.values.delete(name);
  }
}

class FakeElement {
  constructor(id) {
    this.id = id;
    this.value = '';
    this.textContent = '';
    this.innerHTML = '';
    this.className = '';
    this.disabled = false;
    this.style = {};
    this.attributes = {};
    this.classList = new FakeClassList();
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  focus() {
    this.focused = true;
  }

  showModal() {
    this.open = true;
  }

  close() {
    this.open = false;
  }

  querySelector() {
    return new FakeElement(`${this.id}-heading`);
  }
}

function createScheduler() {
  let nextId = 1;
  const timers = new Map();

  return {
    setTimeout(callback, delay) {
      const id = nextId++;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    runAll() {
      const pending = [...timers.entries()];
      timers.clear();
      pending.forEach(([, timer]) => timer.callback());
    },
  };
}

function createStorage(sharedValues = new Map()) {
  return {
    getItem(key) {
      return sharedValues.has(key) ? sharedValues.get(key) : null;
    },
    setItem(key, value) {
      sharedValues.set(key, String(value));
    },
  };
}

function createApp(sharedStorage = new Map()) {
  const elements = new Map();
  const scheduler = createScheduler();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, new FakeElement(id));
      return elements.get(id);
    },
  };

  const context = vm.createContext({
    console,
    document,
    localStorage: createStorage(sharedStorage),
    requestAnimationFrame: callback => callback(),
    setTimeout: scheduler.setTimeout,
    clearTimeout: scheduler.clearTimeout,
    window: { scrollTo() {} },
  });

  vm.runInContext(scriptMatch[1], context, { filename: 'index.html' });

  return {
    element: id => document.getElementById(id),
    run: code => vm.runInContext(code, context),
    runTimers: () => scheduler.runAll(),
  };
}

test('cart totals, quantity changes, and removal stay consistent', () => {
  const app = createApp();

  app.run("addToCart('coffee'); addToCart('coffee'); addToCart('chips');");
  assert.equal(app.run('cartTotal()'), 100);
  assert.equal(app.run("cart.coffee"), 2);

  app.run("changeQty('coffee', -1)");
  assert.equal(app.run('cartTotal()'), 60);

  app.run("removeItem('chips')");
  assert.equal(app.run('cartTotal()'), 40);
});

test('empty carts disable checkout and new transactions reset state', () => {
  const app = createApp();
  assert.equal(app.element('proceedBtn').disabled, true);

  app.run("addToCart('coffee'); setCashAmount(40); payCash(); newTransaction();");
  assert.equal(app.run('cartTotal()'), 0);
  assert.equal(app.run('lastTxn'), null);
  assert.equal(app.element('proceedBtn').disabled, true);
});

test('confirming cancellation clears the order and resets the category', () => {
  const app = createApp();
  assert.equal(app.element('cancelOrderBtn').disabled, true);
  app.run('cancelOrder();');
  assert.notEqual(app.element('cancelOrderDialog').open, true);
  app.run("setCategory('Drinks'); addToCart('coffee'); setCashAmount(80);");
  assert.equal(app.element('cancelOrderBtn').disabled, false);
  app.run('cancelOrder();');
  assert.equal(app.element('cancelOrderDialog').open, true);
  assert.equal(app.run('cartTotal()'), 40);
  app.run('confirmCancelOrder();');
  assert.equal(app.element('cancelOrderDialog').open, false);
  assert.equal(app.run('cartTotal()'), 0);
  assert.equal(app.run('cashAmount'), 0);
  assert.equal(app.run('activeCategory'), 'All');
  assert.equal(app.run('lastTxn'), null);
  assert.equal(app.element('cancelOrderBtn').disabled, true);
  assert.equal(app.element('proceedBtn').disabled, true);
  assert.equal(app.element('screen-order').classList.values.has('active'), true);
});

test('declining cancellation preserves the order and cash amount', () => {
  const app = createApp();
  app.run("setCategory('Drinks'); addToCart('coffee'); setCashAmount(80); cancelOrder(); keepOrder();");
  assert.equal(app.element('cancelOrderDialog').open, false);
  assert.equal(app.run('cart.coffee'), 1);
  assert.equal(app.run('cashAmount'), 80);
  assert.equal(app.run('activeCategory'), 'Drinks');
  assert.equal(app.element('cancelOrderBtn').disabled, false);
});

test('cancel order cannot clear a completed sale', () => {
  const app = createApp();
  app.run("addToCart('coffee'); setCashAmount(40); payCash();");
  const transactionId = app.run('lastTxn.id');
  app.run('cancelOrder();');
  assert.notEqual(app.element('cancelOrderDialog').open, true);
  assert.equal(app.run('lastTxn.id'), transactionId);
  assert.equal(app.run('cartTotal()'), 40);
});

test('cash payment rejects insufficient funds and accepts exact change', () => {
  const app = createApp();
  app.run("addToCart('coffee'); setCashAmount(39); payCash();");

  assert.equal(app.run('lastTxn'), null);
  assert.match(app.element('cashError').innerHTML, /Insufficient payment/);

  app.run('setCashAmount(40); payCash();');
  assert.equal(app.run('lastTxn.total'), 40);
  assert.equal(app.run('lastTxn.paid'), 40);
  assert.equal(app.run('lastTxn.change'), 0);
});

test('cash preview shows the shortage and restores change after editing', () => {
  const app = createApp();
  assert.match(html, /id="changeLabel"/);
  app.run("cart.chips = 5; setCashAmount(80);");
  assert.equal(app.element('changeLabel').textContent, 'Amount short');
  assert.equal(app.element('changeValue').textContent, '₱20.00');
  assert.equal(app.element('changeBox').className, 'change-box insufficient');

  app.run('setCashAmount(100);');
  assert.equal(app.element('changeLabel').textContent, 'Change');
  assert.equal(app.element('changeValue').textContent, '₱0.00');
  assert.equal(app.element('changeBox').className, 'change-box');

  app.run('setCashAmount(120);');
  assert.equal(app.element('changeValue').textContent, '₱20.00');
  app.run("setCashAmount(80); keyPress('Clear');");
  assert.equal(app.element('changeLabel').textContent, 'Change');
  assert.equal(app.element('changeValue').textContent, '—');
  assert.equal(app.element('changeBox').className, 'change-box');
});

test('cash shortcuts are unique and cover totals at denomination boundaries', () => {
  const app = createApp();
  const scenarios = [
    { cart: '{ sandwich: 1 }', amounts: [55, 100, 500, 1000] },
    { cart: '{ chips: 5 }', amounts: [100, 500, 1000] },
    { cart: '{ chips: 25 }', amounts: [500, 1000] },
    { cart: '{ chips: 50 }', amounts: [1000] },
    { cart: '{ chips: 55 }', amounts: [1100] },
    { cart: '{ sandwich: 21 }', amounts: [1155, 1200] },
  ];
  for (const scenario of scenarios) {
    app.run(`cart = ${scenario.cart}; renderQuickAmounts();`);
    const markup = app.element('quickRow').innerHTML;
    const amounts = [...markup.matchAll(/setCashAmount\((\d+)\)/g)].map(match => Number(match[1]));
    assert.deepEqual(amounts, scenario.amounts);
    assert.match(markup, />Exact<\/button>/);
    for (const amount of amounts) {
      app.run(`setCashAmount(${amount});`);
      assert.equal(app.element('changeLabel').textContent, 'Change');
    }
  }
});

test('new transactions reset the category buttons and show every product', () => {
  const app = createApp();
  app.run("setCategory('Drinks'); addToCart('coffee'); setCashAmount(40); payCash(); newTransaction();");
  assert.equal(app.run('activeCategory'), 'All');
  assert.match(app.element('catFilters').innerHTML, /class="cat-btn active"[^>]*aria-pressed="true">All<\/button>/);
  assert.match(app.element('catFilters').innerHTML, /class="cat-btn "[^>]*aria-pressed="false">Drinks<\/button>/);
  for (const name of ['Coffee', 'Iced Tea', 'Sandwich', 'Siomai (6pc)', 'Chips', 'Chocolate Bar']) {
    assert.ok(app.element('productGrid').innerHTML.includes(name), `Missing product: ${name}`);
  }
});

test('product quantity and cash input are bounded', () => {
  const app = createApp();
  app.run("cart.coffee = 99; addToCart('coffee'); changeQty('coffee', 1);");
  assert.equal(app.run('cart.coffee'), 99);

  app.run("keyPress('1'); keyPress('1'); keyPress('1'); keyPress('1'); keyPress('1'); keyPress('1'); keyPress('1'); keyPress('1');");
  assert.equal(app.element('cashInput').value, '1111111');
});

test('leaving the card screen cancels its pending transaction', () => {
  const app = createApp();
  app.run("addToCart('coffee'); goTo('card'); payCard(); goTo('method');");
  app.runTimers();

  assert.equal(app.run('lastTxn'), null);
  assert.equal(app.run('cardPaymentTimer'), null);
});

test('card payment completes from an immutable order snapshot', () => {
  const app = createApp();
  app.run("addToCart('coffee'); goTo('card'); payCard(); cart.coffee = 2;");
  app.runTimers();

  assert.equal(app.run('lastTxn.total'), 40);
  assert.equal(app.run('lastTxn.items[0].qty'), 1);
});

test('a completed order cannot be charged twice', () => {
  const app = createApp();
  app.run("addToCart('coffee')");

  assert.equal(app.run("completeTransaction('Cash', 40, 0)"), true);
  const firstId = app.run('lastTxn.id');
  assert.equal(app.run("completeTransaction('Cash', 40, 0)"), false);
  assert.equal(app.run('lastTxn.id'), firstId);
});

test('transaction counters persist between page sessions', () => {
  const sharedStorage = new Map();
  const firstApp = createApp(sharedStorage);
  firstApp.run("addToCart('coffee'); completeTransaction('Cash', 40, 0);");
  const firstId = firstApp.run('lastTxn.id');

  const secondApp = createApp(sharedStorage);
  secondApp.run("addToCart('chips'); completeTransaction('Cash', 20, 0);");
  const secondId = secondApp.run('lastTxn.id');

  assert.notEqual(secondId, firstId);
  assert.equal(Number(secondId.split('-').at(-1)), Number(firstId.split('-').at(-1)) + 1);
});
