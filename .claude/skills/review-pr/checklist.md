# Default review checklist (bundled with review-tools)

Used only when the consumer repository has no `docs/review-checklist.md`.
Every finding MUST cite exactly one ID.

| ID | Area | Check |
|---|---|---|
| AC-* | Acceptance | Each acceptance criterion in the linked story is implemented and tested. |
| QUAL-1 | Quality | Units are handled exactly (e.g. integer cents); no precision leaks. |
| QUAL-2 | Quality | Boundary conditions have explicit tests. |
| QUAL-3 | Quality | No magic numbers or duplicated literals. |
| SEC-1 | Security | Caller-supplied input is validated before use. |
| SEC-2 | Security | No secrets, tokens, or credentials in code, config, tests, or logs. |
| CMP-1 | Compliance | No personal data in logs. |
| DES-1 | Design | Business rules are pure; time and I/O are injected. |
| DES-2 | Design | Public functions document inputs, outputs, and errors. |

Severity: **blocking** (AC, SEC, CMP failures) - **should-fix** - **nit**.
