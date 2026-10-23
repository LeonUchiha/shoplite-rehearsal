# Review report - FEAT-2 Coupon codes

- **Stage:** Review layer (C2) - review agent + review checklist + secret-scan hook
- **Branch:** `feature/FEAT-2-coupons`
- **Reviewed commit:** `FEAT-2: coupon codes at checkout`
- **Tests:** `npm test` - 9 passing

## Verdict

**RELEASE** - hand off to the next stage: PR generation (C3).

## AC coverage

| AC | Implemented | Test |
|---|---|---|
| AC-1 | yes - percentage discount, `Math.round` to whole cents | "applies a valid percentage coupon", "rounds the discount to whole cents" |
| AC-2 | yes - `trim()` + `toUpperCase()` | "codes are case-insensitive and trimmed" |
| AC-3 | yes - valid through 23:59:59.999 UTC on the expiry date | "valid on its expiry day and expired the day after" |
| AC-4 | yes - discount is a percentage of subtotal, cannot exceed it | covered by AC-1 tests |
| AC-5 | yes | "rejects unknown codes" |

## Checklist results

| Area | Result |
|---|---|
| QUAL | pass - integer cents, boundary tests present. Advisory: coupon table is hard-coded (QUAL-3, move to config in a later story) |
| SEC | pass - no caller-supplied numbers affect money; secret scan clean |
| CMP | pass - no logging of personal data |
| DES | pass - pure function, `today` injected, doc comment present |

Blocking findings: **0**. Advisory: **1**.

> This report is **story evidence**. It stays in the product repo and is never packaged into a plugin.
