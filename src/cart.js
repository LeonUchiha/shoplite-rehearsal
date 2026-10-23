// Feature-1: cart subtotal. All money values are integer cents.

/**
 * Sum line items into a subtotal in cents.
 * @param {{ sku: string, unitPriceCents: number, qty: number }[]} items
 * @returns {number}
 */
export function cartSubtotal(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array");
  }
  return items.reduce((sum, item) => {
    if (!Number.isInteger(item.unitPriceCents) || item.unitPriceCents < 0) {
      throw new RangeError(`invalid price for ${item.sku}`);
    }
    if (!Number.isInteger(item.qty) || item.qty < 1) {
      throw new RangeError(`invalid quantity for ${item.sku}`);
    }
    return sum + item.unitPriceCents * item.qty;
  }, 0);
}
