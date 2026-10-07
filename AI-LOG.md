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

---

---
