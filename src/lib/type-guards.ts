/**
 * Type-safe predicate to filter out null/undefined values.
 * Works correctly in TypeScript <5.5 where filter(Boolean) doesn't narrow types.
 *
 * @example
 * // Basic usage: filter null from an array
 * const arr: (string | null)[] = ["a", null, "b"];
 * const filtered = arr.filter(isNotNull); // string[]
 *
 * @example
 * // Usage with JSON-LD schemas:
 * // const schemas = [collectionSchema, itemListSchema].filter(isNotNull);
 * // jsonLd={schemas} // ✅ now typed as Record<string, unknown>[]
 */
export function isNotNull<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
