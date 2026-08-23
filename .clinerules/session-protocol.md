---
description: Session protocol — handoff log discipline + no-repeat-edit rules
globs:
alwaysApply: true
---

# Session Protocol — Titanium.Blog

This rule forces Cline to maintain a persistent task ledger (`__session_handoff.md`) and to verify on-disk state before any edit. It exists because the previous workflow repeatedly re-did already-deployed fixes and over-engineered tasks with incomplete specifications.

## 1. Handoff Log — `__session_handoff.md` (required, always-on)

**First action of every session**: `read_file __session_handoff.md`. Internalize the `Done` list as a **write-blacklist** — any specific file:line edit that already appears in `Done` is **forbidden** in the current session unless the user explicitly asks to redo it.

**After every non-trivial edit**: append one line to `Done` in the format:

```
- YYYY-MM-DD | <file>:<line> | <before> → <after> | reason: <one sentence>
```

**Trivial edits** (whitespace, formatting, comment fixes) do not need a `Done` entry but **do** need a `read_file` first to confirm the diff is non-trivial.

## 2. Pre-Edit Verification (mandatory)

Before calling `editor` on a file:

1. `read_files` the target file (or the relevant line range).
2. Print the current state of the lines you intend to change.
3. Confirm: does the diff match what the user asked for?
4. **If the file already contains your intended new state** — STOP. Do not write a no-op edit. Tell the user the change is already in place.
5. Only then call `editor`.

## 3. Task Boundary Discipline

When the user gives a high-level directive ("fix X", "align Y"):

- Do **not** expand scope without listing what you intend to do and getting confirmation.
- If the directive is ambiguous (e.g. "对标 A, 完善 B/C/D/E"), the **first response must be a question** asking what A is, what B/C/D/E are, and whether the scope is limited to those or extends to all related pages.
- Never assume A is the page most recently mentioned.

## 4. Git Hygiene

- Debug artifacts (`.ps1` scripts, `*.log`, `build-out.txt`, `check-*.ps1`, `verify-*.ps1`) must never be committed. If created for investigation, delete them before the session ends.
- Before committing, run `git status` and confirm the staged file list matches the user's intent.
- If `git status` shows local commits ahead of `origin/main`, check with the user before pushing.

## 5. Output Discipline

- Default to **paragraph-length answers** for status questions, **code blocks** for actual edits.
- No long preambles. No "I will now..." narration.
- If a response exceeds ~15 lines or 3 paragraphs, rewrite it shorter.
- Never restate the user's question. Answer once.

## 6. What This Rule Does NOT Do

- It does **not** auto-detect "this task is new" vs "this task was already done". The handoff log must be updated **manually** after every edit. If Cline skips an update, the next session will repeat the work.
- It does **not** enforce that Cline ask clarifying questions. It only mandates the format of the question when asked.
- It does **not** override a user's explicit instruction. If the user says "just do X", do X — but `read_file` first.
