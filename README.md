# Snack Stop — Touchscreen POS Kiosk

A self-service kiosk application built for IT415 — Application Development and
Emerging Technologies. Customers select products, review their order, choose a
payment method, complete payment, and receive a digital receipt.

## How to run it
No build tools or installation required.
1. Clone this repository: `git clone https://github.com/gehleegian/IT415-POS-KioskSystem.git`
2. Open `index.html` directly in any modern web browser (double-click it, or
   right-click → Open With → your browser).

That's it — the entire app (HTML, CSS, and JavaScript) lives in one
self-contained file, so there's no server or dependency setup needed.

## Technology choices
- **Language/framework:** Vanilla HTML, CSS, and JavaScript (no framework).
  Chosen for simplicity, zero build-step setup, and because every group
  member can read and explain the full codebase without needing to learn a
  framework first.
- **Data storage:** In-memory JavaScript state tracks the active order. A
  transaction counter is stored in the browser's `localStorage` so receipt
  references do not reset when the kiosk page is refreshed. No database is
  used because the exam does not require cross-device persistence.
- **Styling:** Plain CSS with CSS custom properties (`:root` variables) for
  the color system, and Google Fonts (Space Grotesk + Inter) for type.

## Required transaction flow
1. **Item Selection** — tap a product's `+` button to add it; adjust quantity with
   +/− controls in the cart panel; remove items entirely.
2. **Order Review** — confirms the same items, quantities, and total from
   Item Selection before payment.
3. **Payment Method** — choose Cash, QR Payment, or Credit/Debit Card.
4. **Payment Processing** — Cash validates the amount and calculates change;
   QR and Card are simulated and complete with ₱0.00 change.
5. **Payment Successful** — shows the transaction number, method, amount,
   amount paid, and change.
6. **Receipt** — full digital receipt matching the completed transaction.
7. **New Transaction** — clears the cart, payment details, and receipt, and
   returns to Item Selection.

## Group contributions
| Member | GitHub username | Feature branch(es) | Contribution |
|---|---|---|---|
| Dennis Mark L. Jamero | @sinnedun (https://github.com/sinnedun) | `main` (setup commit) | Initial project setup — added the base kiosk application (`index.html`), `README.md`, and `AI-LOG.md` to the shared repository |
| Gian Carlo R. Marin | @gehleegian (https://github.com/gehleegian) | `feature/ui-improvements` | Improved product controls, accessibility, payment-state safety, transaction references, receipt printing, validation, documentation, and automated tests |
| Wendyl Ziv Arellano | @(https://github.com/Boytooo) | `feature/wendyl-improvements` | Improved cash payment guidance with an amount-short preview and unique cash shortcuts, reset the category to All for new transactions, added a centered Cancel Order confirmation dialog
 |


## Automated tests

The test suite uses Node.js's built-in test runner and requires no package
installation. With Node.js 18 or newer installed, run:

```bash
npm test
```

The tests cover cart totals and quantity limits, cash validation, transaction
reset behavior, persistent transaction counters, duplicate-payment protection,
and cancellation of an in-progress card payment.

## AI usage
See `AI-LOG.md` in this repository for documented AI prompts, responses,
evaluations, and modifications, as required by the checklist.
