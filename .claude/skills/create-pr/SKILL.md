---
name: create-pr
description: Open a DRAFT pull request for the current feature branch via the GitHub MCP server, summarising the story and the C2 review outcome. Only run when the user explicitly asks to create a PR.
disable-model-invocation: true
---

# create-pr - open a draft pull request (deliberate action)

Creating a PR changes **remote** state. Run only because the user invoked this explicitly.
Never merge, never push, never create branches, never change code.

## Inputs

- Optional argument: the base branch (default `main`) and/or a story ID such as `FEAT-2`.

## Steps

1. **Confirm the branches** (read-only git):
   - `git branch --show-current` -> source (head) branch. Stop if it is the base branch.
   - `git remote get-url origin` -> derive `owner` and `repo`.
   - `git status --porcelain` -> if there are uncommitted changes, stop and tell the user.
   - `git ls-remote --heads origin <head>` -> if the branch is not on the remote, stop and ask the
     user to push it themselves. Do **not** push.
2. **Pipeline gate - the review layer must have released this change**:
   - Read the review report in `docs/reviews/` for this story.
   - If there is no report, or its verdict is not `RELEASE`, **stop**: say
     "The review layer has not released this change - send it back for remediation." Do not create a PR.
3. **Gather the change summary**:
   - `git log --oneline <base>..<head>` and `git diff --stat <base>...<head>`.
   - Read the story in `docs/stories/` whose ID matches the branch name (e.g. `FEAT-2`).
   - The report names its **reviewed commit**. List every commit on the branch that is newer than it:
     those changes were never seen by the review layer.
4. **Draft the PR** and show it to the user:
   - Title: `<STORY-ID>: <story title>`
   - Body sections: `## Story`, `## What changed`, `## Review layer outcome` (verdict + checklist results),
     `## Not covered by the review layer` (the newer commits, or "none"),
     `## How to test` (`npm test`), and the line
     `> Opened as a draft by the create-pr skill. A human owns merge.`
   - If any commits are not covered, tell the user a PR review is required before leaving draft.
5. **Ask for explicit confirmation**: print owner/repo, head -> base, title, and `draft: true`,
   then ask "Create this draft PR? (yes/no)". Continue only on an explicit yes.
6. **Create it** with the GitHub MCP tool `create_pull_request`:
   `owner`, `repo`, `title`, `body`, `head`, `base`, `draft: true`.
7. **Return evidence**: the real PR **number** and **html URL** from the tool result.
   If the tool call failed, say so and show the error. Never invent a URL.

## Out of scope

Merging, pushing, force-pushing, requesting reviewers, editing files.
