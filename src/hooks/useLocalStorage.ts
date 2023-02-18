import { Dispatch, SetStateAction, useState, useEffect } from 'react';

import { useLocalStorage as useHooksLocalStorage } from 'usehooks-ts';

export const useLocalStorage = <T>(
  key: string,
  fallbackValue: T,
): readonly [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useHooksLocalStorage(key, fallbackValue);

  // Needed to prevent mismatch between the first render on server and client
  const [outputValue, setOutputValue] = useState(fallbackValue);
  useEffect(() => setOutputValue(value), [value]);

  return [outputValue, setValue] as const;
};
