# AI Usage Log

This log documents AI-assisted development for the Snack Stop kiosk project,
as required by the Development Process Verification checklist ("AI prompts,
responses, evaluations, and modifications are documented").

Each entry should be filled in by the member who used AI for that piece of
work. Add one entry per meaningful AI interaction — not every tiny tweak.

---

## Entry template (copy this block for each use)

**Date:**
**Member:**
**Feature / task:**
**Tool used:** (e.g. Claude, ChatGPT, GitHub Copilot)

**Prompt (summarized or verbatim):**


**AI's response (summarized):**


**Evaluation — was the output correct/usable as-is?**


**Modifications made (what you changed and why):**


---

## Example entry (for reference — delete or replace with your own)

**Date:** 2026-10-07
**Member:** [Name]
**Feature / task:** Cash payment validation
**Tool used:** Claude

**Prompt (summarized):** Asked for logic to reject cash payments below the
order total and calculate change correctly, including the exact-payment edge
case.

**AI's response (summarized):** Provided a function comparing amount paid to
total, returning an error message when insufficient, and computing
`change = amountPaid - total` otherwise.

**Evaluation:** Logic was correct, but didn't initially handle a blank/empty
input — would have thrown rather than showing a validation message.

**Modifications made:** Added a check for empty or non-numeric input before
the insufficient-funds comparison, and adjusted the error message wording to
match the exam's required phrasing ("Insufficient payment. Please enter at
least ₱___.").
