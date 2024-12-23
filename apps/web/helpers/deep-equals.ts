/**
 * Compares two objects or arrays for deep equality.
 *
 * @template T - The type of the objects being compared.
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @param [visited=new Set()] - A set of already visited objects to handle cyclic references.
 * @returns - Returns `true` if the objects are deeply equal, otherwise `false`.
 */
export const deepEquals = <T>(obj1: T, obj2: T, visited = new Set()): boolean => {
  // If both are the same object or primitive, return true
  if (obj1 === obj2) return true;

  // If either is not an object (or is null), return false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  // If we have already visited one of the objects, we are in a cycle
  if (visited.has(obj1) || visited.has(obj2)) return false;

  // Add the current objects to the visited set
  visited.add(obj1);
  visited.add(obj2);

  // If both are arrays, compare arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;

    for (let i = 0; i < obj1.length; i++) {
      if (!deepEquals(obj1[i], obj2[i], visited)) return false;
    }
    return true;
  }

  // If both are objects, compare object keys and values
  const keys1 = Object.keys(obj1) as (keyof T)[];
  const keys2 = Object.keys(obj2) as (keyof T)[];

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEquals(obj1[key], obj2[key], visited)) {
      return false;
    }
  }

  return true;
};
