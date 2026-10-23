---
description: Open a DRAFT pull request for the current branch via GitHub MCP (deliberate action only)
agent: agent
tools: ['runCommands', 'search', 'github/create_pull_request']
---

Follow `.claude/skills/create-pr/SKILL.md` exactly. It is the same procedure for every tool:
confirm branches with read-only git, summarise the story in `docs/stories/` and the C2 report in
`docs/reviews/`, show the draft, ask for an explicit **yes**, then call `create_pull_request`
with `draft: true` and return the real PR number and URL. Never push or merge.
