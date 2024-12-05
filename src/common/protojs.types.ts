export type ProtobufNumber = string | number;

/**
 * Protobuf message encoded in the regular format returned by default by the
 * Tailwind API.
 *
 * @example
 * ```ts
 * // Numbers are coerced to strings.
 * {
 *   1: {
 *     2: 'foo',
 *     3: {
 *       42: 'bar',
 *       43: false,
 *       44: null,
 *     },
 *   },
 *   2: [true, false, true],
 * },
 * ```
 */
export type ProtobufObject = any;
