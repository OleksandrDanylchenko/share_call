import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useUpdateEffect } from 'usehooks-ts';

export const useLocalStorage = <T>(
  key: string,
  fallbackValue: T,
): readonly [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(fallbackValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    setValue(stored ? JSON.parse(stored) : fallbackValue);
  }, [key, fallbackValue]);

  useUpdateEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [key, value],
  );

  return [value, setValue] as const;
};
