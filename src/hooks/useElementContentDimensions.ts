import { MutableRefObject, useCallback, useEffect, useState } from 'react';

import { useEventListener } from 'usehooks-ts';

import { Dimensions } from '@/types/index';

export const useElementContentDimensions = <T extends HTMLElement | null>(
  ref: MutableRefObject<T>,
): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const updateDimensions = useCallback((): void => {
    const { current: element } = ref;
    if (!element) return;

    const { width, height } = element.getBoundingClientRect();
    const paddingLeft = parseInt(window.getComputedStyle(element).paddingLeft);
    const paddingRight = parseInt(
      window.getComputedStyle(element).paddingRight,
    );
    const paddingTop = parseInt(window.getComputedStyle(element).paddingTop);
    const paddingBottom = parseInt(
      window.getComputedStyle(element).paddingBottom,
    );
    const actualWidth = width - paddingLeft - paddingRight;
    const actualHeight = height - paddingTop - paddingBottom;
    setDimensions({
      width: actualWidth,
      height: actualHeight,
    });
  }, [ref]);

  useEffect(updateDimensions, [updateDimensions]);
  useEventListener('resize', updateDimensions);

  return dimensions;
};
