# AI Usage Log

This log documents AI-assisted development for the Snack Stop kiosk project,
as required by the Development Process Verification checklist ("AI prompts,
responses, evaluations, and modifications are documented").

Each entry should be filled in by the member who used AI for that piece of
work. Add one entry per meaningful AI interaction — not every tiny tweak.

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
