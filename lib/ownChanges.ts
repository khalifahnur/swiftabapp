/**
 * Order changes the diner made themselves (asking for the bill, cancelling).
 * The screen that made the change already says so, so the order watcher
 * leaves these alone instead of announcing them a second time.
 */
const own = new Map<string, string>();

export const noteOwnChange = (orderId: string, status: string) => {
  own.set(orderId, status);
};

/** True once for a change recorded with noteOwnChange. */
export const wasOwnChange = (orderId: string, status: string) => {
  if (own.get(orderId) !== status) return false;
  own.delete(orderId);
  return true;
};
