# Snack Stop — Touchscreen POS Kiosk

A self-service kiosk application built for IT415 — Application Development and
Emerging Technologies. Customers select products, review their order, choose a
payment method, complete payment, and receive a digital receipt.

## How to run it
No build tools or installation required.
1. Clone this repository: `git clone <repo-url>`
2. Open `index.html` directly in any modern web browser (double-click it, or
   right-click → Open With → your browser).

That's it — the entire app (HTML, CSS, and JavaScript) lives in one
self-contained file, so there's no server or dependency setup needed.

## Technology choices
- **Language/framework:** Vanilla HTML, CSS, and JavaScript (no framework).
  Chosen for simplicity, zero build-step setup, and because every group
  member can read and explain the full codebase without needing to learn a
  framework first.
- **Data storage:** In-memory JavaScript state (a `cart` object and a
  `PRODUCTS` array). No database is used, since the kiosk only needs to
  track one active order/session at a time and the exam does not require
  persistence between sessions.
- **Styling:** Plain CSS with CSS custom properties (`:root` variables) for
  the color system, and Google Fonts (Space Grotesk + Inter) for type.

## Required transaction flow
1. **Item Selection** — tap product cards to add them; adjust quantity with
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
| [Name] | [@username] | `feature/...` | [What they built] |
| [Name] | [@username] | `feature/...` | [What they built] |
| [Name] | [@username] | `feature/...` | [What they built] |

*(Fill in actual names, usernames, and branches before submission — this maps
directly to the Member Register on the Acceptance Checklist.)*

## AI usage
See `AI-LOG.md` in this repository for documented AI prompts, responses,
evaluations, and modifications, as required by the checklist.
