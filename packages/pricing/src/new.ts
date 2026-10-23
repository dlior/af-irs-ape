/**
 * Next-gen pricing calculator (`@ape/pricing/new`).
 * Accepts two numbers plus an optional initial value (defaults to 0).
 */
export function add(a: number, b: number, initialValue = 0): number {
  return initialValue + a + b;
}
