import { useRef } from 'react';

import { random } from 'lodash';

const compliments = [
  'amazing',
  'awesome',
  'beautiful',
  'brilliant',
  'cool',
  'cute',
  'dazzling',
  'dope',
  'fabulous',
  'fantastic',
  'genius',
  'gorgeous',
  'great',
  'handsome',
  'incredible',
  'intelligent',
  'lovely',
  'marvelous',
  'nice',
  'perfect',
  'phenomenal',
  'pretty',
  'smart',
  'spectacular',
  'stunning',
  'super',
  'talented',
  'terrific',
  'wonderful',
];

export const useCompliment = (): string => {
  const compliment = useRef(compliments[random(0, compliments.length - 1)]);
  return compliment.current!;
};
