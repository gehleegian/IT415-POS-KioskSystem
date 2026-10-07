# AI Usage Log

This log documents AI-assisted development for the Snack Stop kiosk project,
as required by the Development Process Verification checklist ("AI prompts,
responses, evaluations, and modifications are documented").

Each entry should be filled in by the member who used AI for that piece of
work. Add one entry per meaningful AI interaction — not every tiny tweak.

---

**Date:** October 7, 2026
**Member:** Wendyl Ziv Arellano
**Feature / task:** Centered Cancel Order popup
**Tool used:** ChatGPT Codex

**Prompt (summarized):** Asked to move the cancellation confirmation from the
browser's top prompt into a popup in the middle of the kiosk.

**AI's response (summarized):** Replaced browser confirmation with a centered
HTML dialog, dimmed backdrop, Keep Order and Cancel Order buttons, and initial
focus on Keep Order. The native dialog supports Escape and modal focus handling.

**Evaluation — was the output correct/usable as-is?** Passed `git diff --check`
and updated cancellation regression tests. The user confirmed the result was
working before requesting the commit and push. Automated tests remain pending
because Node.js/npm are unavailable in the terminal environment.

**Modifications made (what you changed and why):** Matched the kiosk's existing
colors and button styles and kept the order intact until cancellation is
explicitly confirmed in the popup.

---

**Date:** October 7, 2026
**Member:** Wendyl Ziv Arellano
**Feature / task:** Cancel Order with confirmation
**Tool used:** ChatGPT Codex

**Prompt (summarized):** Asked Codex to implement the suggested Cancel Order
button so customers can abandon an order after confirming.

**AI's response (summarized):** Added a Cancel Order button beneath checkout,
disabled it for an empty cart, and used a browser confirmation before clearing
the order. Confirmation resets the cart, payment state, and category to All;
declining preserves the order. Completed transactions cannot be cancelled.

**Evaluation — was the output correct/usable as-is?** Passed `git diff --check`.
Added regression tests for confirmation, declining, empty carts, and completed
sales. Node.js/npm are unavailable in the terminal, so automated tests and
manual browser verification remain pending.

**Modifications made (what you changed and why):** Reused the existing
transaction reset and added a cancellation message. Used a browser confirmation
to protect against accidentally clearing the customer's selections.

---

**Date:** October 7, 2026
**Member:** Wendyl Ziv Arellano
**Feature / task:** Cash preview, cash shortcuts, and category reset
**Tool used:** ChatGPT Codex

**Prompt (summarized):** Asked Codex to show a positive amount short for
insufficient cash, show only unique cash shortcuts that cover the order total,
and start each new transaction with the All category selected.

**AI's response (summarized):** Updated the cash preview label and amount,
filtered duplicate and insufficient shortcuts while keeping Exact, reset the
category state and buttons, and added regression tests for all three behaviors.

**Evaluation — was the output correct/usable as-is?** Reviewed the changes and
passed `git diff --check`. Automated tests could not run because Node.js and
npm are unavailable in the current terminal environment. Browser verification
and running `npm test` with Node.js 18 or newer remain pending.

**Modifications made (what you changed and why):** Applied the three requested
customer-facing fixes within the existing design. Tests cover shortage labels,
exact and excess cash, clearing input, shortcut denomination boundaries, and
resetting the selected category and visible products after a completed sale.

---

**Date:** October 7, 2026
**Member:** Dennis Mark L. Jamero
**Feature / task:** Initial project setup — base kiosk application (HTML/CSS/JS)
**Tool used:** Claude

**Prompt (summarized):** Asked Claude to build a fully working touchscreen POS
kiosk application matching the practical exam's required transaction flow
(Item Selection, Order Review, Payment Method, Payment Processing, Payment
Successful, Receipt, New Transaction), following the sample UI's functional
flow but with a visually distinct design rather than a direct copy.

**AI's response (summarized):** Provided a single self-contained index.html
file implementing the full flow in vanilla HTML/CSS/JS — product grid with
category filters, live cart with quantity controls, order review table,
three payment methods (Cash with validation and change calculation, QR and
Card as simulated flows), a Payment Successful confirmation with a generated
transaction reference, a digital receipt, and a New Transaction reset. Also
provided a starter README.md and this AI-LOG.md template.

**Evaluation — was the output correct/usable as-is?** The app worked
correctly on first test: cart math, insufficient-cash rejection, exact-change
handling, and the receipt all matched the exam's expected values. The only
issue was unrelated to the code itself — when first pushed, index.html
appeared empty on GitHub because the content hadn't been saved into the
tracked file before committing.

**Modifications made (what you changed and why):** Re-copied the full file
content into the tracked index.html in the local repo, verified with
`git status` that it was picked up as a real change, then committed and
pushed again so the complete file was reflected on GitHub.


---

**Date:** October 7, 2026
**Member:** Gian Carlo R. Marin
**Feature / task:** UI, accessibility, transaction safety, and automated tests
**Tool used:** ChatGPT Codex

**Prompt (summarized):** Asked Codex to analyze the existing kiosk, add a
dedicated `+` product button, update its instructions, and fix the nine
recommended reliability, accessibility, print, validation, testing, and
documentation issues.

**AI's response (summarized):** Reviewed the single-file application and
implemented explicit product controls, larger accessible cart controls,
keyboard and screen-reader improvements, bounded input values, cancellation
of pending card payments, duplicate-completion protection, persistent receipt
numbers, receipt-only print styling, dependency-free automated tests, and
completed project documentation.

**Evaluation — was the output correct/usable as-is?** The JavaScript passed a
syntax check, the application initialized in a headless browser, and the Node
test suite passed all transaction scenarios.

**Modifications made (what you changed and why):** Integrated the suggested
changes into the existing visual design, kept QR and card payments explicitly
simulated for the exam scope, and used browser `localStorage` only for the
transaction counter so the active order still resets between kiosk sessions.


---

---

---
