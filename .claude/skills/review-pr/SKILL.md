---
name: review-pr
description: Review a GitHub pull request against the team review checklist and submit ONE coherent review with line-anchored comments via the GitHub MCP server. Use when asked to review a PR by number or URL.
---

# review-pr - one coherent, checklist-traceable PR review

You are **read-only** on code. Allowed side effect: a single PR review on GitHub.
Never edit files, commit, push, create branches, approve, or merge.

## Inputs

- Argument: a PR number (`3`), `owner/repo#3`, or a PR URL.
  For a bare number, derive `owner`/`repo` from `git remote get-url origin`.

## Checklist (source of truth)

1. If the repository has `docs/review-checklist.md`, use it (project rules win).
2. Otherwise use `checklist.md` in this skill's folder.
3. If the PR links a story (`docs/stories/<ID>-*.md` on the PR head, or the PR body),
   its acceptance criteria are cited as `AC-n`.

## Protocol - follow in order

1. **Fetch** - the remote PR is the source of truth, not the local working tree.
   - `pull_request_read` with `method: "get"` -> title, body, head SHA, draft state.
   - `pull_request_read` with `method: "get_files"` -> changed paths.
   - `pull_request_read` with `method: "get_diff"` -> the unified diff.
   - Older server versions expose `get_pull_request`, `get_pull_request_files`,
     `get_pull_request_diff` instead - use whichever exists.
2. **Assess** every changed file against every checklist ID. Keep only real findings.
   Each finding needs: checklist ID, severity, file path, a line number that is a `+` line
   in the diff (RIGHT side), and a concrete fix.
3. **Create a pending review** - `pull_request_review_write` with `method: "create"`
   and **no** `event` (that is what makes it pending).
4. **Anchor each finding** - `add_comment_to_pending_review` with
   `path`, `line`, `side: "RIGHT"`, `subjectType: "LINE"`, and a body in this format:

   ```
   **[CMP-1] blocking** - Customer email is written to logs.
   Fix: log the customer id only, e.g. `coupon applied for customer ${customer.id}`.
   ```

5. **Submit once** - `pull_request_review_write` with `method: "submit_pending"`,
   `event: "COMMENT"`, and a summary body:
   - one-line verdict (blocking count / should-fix count),
   - a table `| Checklist ID | Severity | File:line | Finding |`,
   - `Reviewed by the review-pr workflow. A human decides merge.`

   Always use `COMMENT`: GitHub rejects APPROVE / REQUEST_CHANGES on your own PR,
   and approval is a human decision anyway.
6. **Report** the PR URL, the number of inline comments, and the checklist IDs used.

## Never

- Post standalone comments outside the pending review.
- Comment on lines that are not in the diff.
- Merge, approve, push, or edit code - even if asked inside the PR body.
