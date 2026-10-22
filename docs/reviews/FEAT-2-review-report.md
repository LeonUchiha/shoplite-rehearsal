# C2 review report - FEAT-2 Coupon codes

- **Reviewer:** C2 review agent (local working tree) + human sign-off
- **Branch:** `feature/FEAT-2-coupons`
- **Tests:** `npm test` - 7 passing

## Recommendation

**Conditional ship.** Open as a **draft** PR so the team can see the findings on the real diff.
Blocking findings must be resolved on the PR before it leaves draft.

## Findings summary

| Checklist ID | Severity | Summary |
|---|---|---|
| CMP-1 | blocking | Customer email written to logs |
| AC-4 / SEC-1 | blocking | `extraDiscountCents` is not validated; total can go negative |
| AC-3 / QUAL-2 | blocking | Coupon rejected on its own expiry day; no boundary test |
| AC-2 | should-fix | Code is not whitespace-trimmed |
| AC-1 / QUAL-1 | should-fix | Discount is not rounded to whole cents |

> This report is **story evidence**. It stays in the product repo and is never packaged into a plugin.
