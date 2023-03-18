export const isValueInStringEnum = <T extends Record<keyof T, string>>(
  value: string | undefined,
  enumObject: T extends Record<keyof T, string> ? T : never,
): value is T[keyof T] => Object.values(enumObject).includes(value);
