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
