// @flow
/**
 * @file Utilities for manipulating strings
 */

export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
