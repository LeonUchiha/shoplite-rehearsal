# Review checklist (committed in C2)

Every review finding MUST cite exactly one ID from this list, e.g. `[CMP-1]`.
Story acceptance criteria are cited by their own IDs, e.g. `[AC-3]`.

## AC - Acceptance criteria
| ID | Check |
|---|---|
| AC-* | Each acceptance criterion in the linked story is implemented **and** covered by a test. Cite the story's AC ID. |

## QUAL - Code quality
| ID | Check |
|---|---|
| QUAL-1 | Money is handled in integer cents; no fractional cents leak out of a function. |
| QUAL-2 | Boundary conditions (dates, zero, max values) have explicit tests. |
| QUAL-3 | No magic numbers or duplicated literals; names explain intent. |

## SEC - Security
| ID | Check |
|---|---|
| SEC-1 | All caller-supplied input is validated (type and range) before it affects money or state. |
| SEC-2 | No secrets, tokens, or credentials in code, config, tests, or logs. |

## CMP - Compliance
| ID | Check |
|---|---|
| CMP-1 | No personal data (email, name, address, phone) is written to logs. |

## DES - Design
| ID | Check |
|---|---|
| DES-1 | Business rules are pure functions; time and I/O are injected, not read globally. |
| DES-2 | Public functions have a doc comment describing inputs, outputs, and error results. |

## Severity
- **blocking** - must be fixed before merge (any AC, SEC, or CMP failure)
- **should-fix** - fix in this PR unless the team agrees otherwise
- **nit** - optional
