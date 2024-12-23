import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import queryString, { type ParsedQuery } from 'query-string';
import { useCallback } from 'react';

type QueryParamArgs = Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined>;

type SetSearchParamsConfig = {
  skipNull?: boolean;
  skipEmptyString?: boolean;
  skipFalse?: boolean;
};

type UseQueryParams = () => {
  getSearchParams: () => ParsedQuery<string | number | boolean | (string | number | boolean)[] | null | undefined>;
  setSearchParams: (params: QueryParamArgs, options?: SetSearchParamsConfig) => void;
  addQueryParams: (params: QueryParamArgs) => void;
  removeQueryParams: (keys: string[]) => void;
};

/**
 * Custom hook for managing query parameters in the URL.
 *
 * @returns An object containing methods to get, set, add, and remove query parameters.
 */
export const useQueryParams: UseQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Sets the search parameters in the URL and replaces the current URL with the updated one.
   *
   * @param params - The query parameters to set in the URL.
   * @param config - Configuration options to skip null, empty strings, or boolean false values.
   */
  const setSearchParams = useCallback(
    (params: QueryParamArgs, config: SetSearchParamsConfig = {}) => {
      const { skipNull = true, skipEmptyString = true, skipFalse = false } = config;

      const currentParams = searchParams ? queryString.parse(searchParams.toString()) : {};
      const mergedParams: Record<string, string | (string | null)[] | null> = { ...currentParams };

      for (const [key, value] of Object.entries(params)) {
        if (value === null && skipNull) {
          delete mergedParams[key]; // Remove null values
          continue;
        }
        if (typeof value === 'string' && value === '' && skipEmptyString) {
          delete mergedParams[key]; // Remove empty strings
          continue;
        }
        if (typeof value === 'boolean' && value === false && skipFalse) {
          delete mergedParams[key]; // Remove false boolean values
          continue;
        }

        // Convert numbers and booleans to strings before setting the query parameters
        if (Array.isArray(value)) {
          mergedParams[key] = value.map((v) => String(v));
        } else if (value !== null && value !== undefined) {
          mergedParams[key] = String(value);
        }
      }

      const newSearchParams = queryString.stringify(mergedParams, {
        arrayFormat: 'comma',
        skipNull, // Pass through options
        skipEmptyString,
      });

      router.replace(`${pathname}?${newSearchParams}`);
    },
    [router, pathname, searchParams],
  );

  /**
   * Adds query parameters to the existing ones in the URL.
   *
   * @param params - The query parameters to add to the URL.
   */
  const addQueryParams = useCallback(
    (params: QueryParamArgs) => {
      const currentParams = searchParams ? queryString.parse(searchParams.toString(), {
        arrayFormat: 'comma',
      }) : {};

      const updatedParams: Record<string, string | (string | null)[] | null> = { ...currentParams };

      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
          updatedParams[key] = value.map((v) => String(v));
        } else if (value !== null && value !== undefined) {
          updatedParams[key] = String(value);
        }
      }

      const newSearchParams = queryString.stringify(updatedParams, {
        arrayFormat: 'comma',
        skipNull: true,
        skipEmptyString: true,
      });

      router.replace(`${pathname}?${newSearchParams}`);
    },
    [router, pathname, searchParams],
  );

  /**
   * Removes specific query parameters by key from the URL.
   *
   * @param keys - An array of keys representing the query parameters to remove.
   */
  const removeQueryParams = useCallback(
    (keys: string[]) => {
      const currentParams = searchParams ? queryString.parse(searchParams.toString(), {
        arrayFormat: 'comma',
      }) : {};

      for (const key of keys) {
        delete currentParams[key];
      }

      const newSearchParams = queryString.stringify(currentParams, {
        arrayFormat: 'comma',
        skipNull: true,
        skipEmptyString: true,
      });

      router.replace(`${pathname}?${newSearchParams}`);
    },
    [router, pathname, searchParams],
  );

  /**
   * Retrieves the search parameters from the URL and returns them as an object.
   *
   * @returns An object containing the search parameters as key-value pairs.
   */
  const getSearchParams = useCallback(() => {
    // Parse the params using queryString.parse to handle arrays
    const parsed = searchParams ? queryString.parse(searchParams.toString(), {
      arrayFormat: 'comma', // Must match the format used in setSearchParams
      decode: true,
    }) : {};

    return parsed;
  }, [searchParams]);

  return {
    getSearchParams,
    setSearchParams,
    addQueryParams,
    removeQueryParams,
  };
};
