# FEAT-2 - Coupon codes at checkout

**As a** shopper
**I want** to enter a coupon code at checkout
**So that** I get the advertised discount on my order.

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | A valid code applies its percentage discount to the cart subtotal. The discount is rounded to whole cents. |
| AC-2 | Codes are case-insensitive and ignore leading/trailing whitespace (`" save10 "` works). |
| AC-3 | A coupon is valid **through the end of** its expiry date (inclusive). After that it is rejected with `EXPIRED`. |
| AC-4 | The order total can never go below 0, and the discount can never exceed the subtotal. |
| AC-5 | Unknown codes are rejected with `UNKNOWN_COUPON`. |

## Out of scope

- Stacking multiple coupons
- Per-customer usage limits
