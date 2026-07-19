/**
 * Type-safe predicate to filter out null/undefined values.
 * Works correctly in TypeScript <5.5 where filter(Boolean) doesn't narrow types.
 *
 * @example
 * const arr: (string | null)[] = ["a", null, "b"];
 * const filtered = arr.filter(isNotNull); // string[]
 */
export function isNotNull<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
