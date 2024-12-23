import * as argon2 from 'argon2';

/**
 * Hashes a password using the Argon2 algorithm.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = (password: string) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    parallelism: 1,
  });
};
