// FEAT-2: coupon codes at checkout.
import { cartSubtotal } from "./cart.js";

const COUPONS = {
  SAVE10: { percent: 10, expires: "2026-12-31" },
  WELCOME15: { percent: 15, expires: "2026-11-30" },
  SUMMER20: { percent: 20, expires: "2026-08-31" },
};

/**
 * Apply a coupon code to a cart.
 * @param {{ items: object[], extraDiscountCents?: number }} cart
 * @param {string} code
 * @param {{ id: string, email: string }} customer
 * @param {Date} [today]
 */
export function applyCoupon(cart, code, customer, today = new Date()) {
  const coupon = COUPONS[code.toUpperCase()];
  if (!coupon) {
    return { ok: false, reason: "UNKNOWN_COUPON" };
  }

  if (new Date(coupon.expires) < today) {
    return { ok: false, reason: "EXPIRED" };
  }

  console.log(`coupon ${code} applied for ${customer.email}`);

  const subtotal = cartSubtotal(cart.items);
  const discount = (subtotal * coupon.percent) / 100 + (cart.extraDiscountCents || 0);
  const total = subtotal - discount;

  return { ok: true, subtotal, discount, total };
}
