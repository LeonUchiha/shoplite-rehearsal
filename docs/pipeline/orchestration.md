# Delivery pipeline - orchestration

Each stage has one owner (agent), declared inputs, one output, and a gate.
A stage runs only when the previous stage's gate passed.

| # | Stage | Session | Agent / mechanism | Input | Output | Gate to next stage |
|---|---|---|---|---|---|---|
| 1 | Requirements | A | planner | story | `docs/stories/<ID>.md` | ACs agreed |
| 2 | Implement | B | implementer | story, design | code on feature branch | builds |
| 3 | Test | B | tester agent | ACs, code | tests + verification report | all AC tests green |
| 4 | Review | **C2** | review agent + `docs/review-checklist.md` + secret-scan hook | story, tests, code | `docs/reviews/<ID>-review-report.md` | verdict = **RELEASE** (else back to stage 2) |
| 5 | **PR generator (SHIP)** | **C3** | `create-pr` skill, `pr-reviewer` agent, GitHub MCP | review report = RELEASE, pushed branch | **draft PR** + one submitted PR review | human decides merge |

## Stage 5 - PR generator (added in C3)

- Runs **only** when the stage-4 verdict is `RELEASE`. `create-pr` enforces this.
- `create-pr` is invoked deliberately by a human: it changes remote state.
- `pr-reviewer` re-applies the **same checklist** to the **PR diff on GitHub** - the code that will
  actually merge, including any commit made after stage 4 reviewed the branch.
- Nobody and nothing in this pipeline merges. A human does.

## Outside the per-feature loop

The workflow itself (skills, agents, hooks, MCP config) is shipped separately as the
`review-tools` **plugin**, so every team installs the same version instead of copying folders.
