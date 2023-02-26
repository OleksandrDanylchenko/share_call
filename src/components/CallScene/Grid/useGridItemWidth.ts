import { MutableRefObject, useCallback, useState } from 'react';

import { useEffectOnce, useEventListener } from 'usehooks-ts';

type Dimensions = {
  width: number;
  height: number;
};

export const useGridItemDimensions = <T extends HTMLElement>(options: {
  containerRef: MutableRefObject<T | undefined | null>;
  itemsCount: number;
  ratio?: '16/9' | '4/3' | '1/2' | '1/1';
  spacing?: number;
}): Dimensions => {
  const { containerRef, itemsCount, ratio = '16/9', spacing = 0 } = options;

  const ratioCoef = ratio
    .split('/')
    .map(Number)
    .reduce((a, b) => b / a);

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  const resizeItem = useCallback(() => {
    const { current: containerEl } = containerRef;
    if (!containerEl) return;

    const { offsetWidth: containerWidth, offsetHeight: containerHeight } =
      containerEl;

    let maxItemWidth = 0;
    let possibleWidth = 1;
    while (
      possibleWidth <= containerWidth &&
      checkItemsFitGrid(possibleWidth)
    ) {
      maxItemWidth = possibleWidth;
      possibleWidth++;
    }

    return setDimensions({
      width: maxItemWidth,
      height: maxItemWidth * ratioCoef,
    });

    function checkItemsFitGrid(possibleWidth: number): boolean {
      let occupiedWidth = 0;
      let occupiedHeight = possibleWidth * ratioCoef + spacing;

      for (let i = 0; i < itemsCount; i++) {
        if (occupiedWidth + possibleWidth > containerWidth) {
          occupiedWidth = 0;
          occupiedHeight += possibleWidth * ratioCoef + spacing;
        }
        occupiedWidth += possibleWidth + spacing;
      }

      return occupiedHeight < containerHeight;
    }
  }, [containerRef, itemsCount, ratioCoef, spacing]);

  useEffectOnce(resizeItem);
  useEventListener('resize', resizeItem);

  return dimensions;
};
