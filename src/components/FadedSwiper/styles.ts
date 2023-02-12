import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

import type { Props as FadedSwiperProps } from './index';

export const showcaseSwiper = (
  theme: Theme,
  options: { fadeSide: FadedSwiperProps['fadeSide'] },
): SerializedStyles => {
  const { fadeSide } = options;

  return css`
    .swiper-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      direction: ltr;
    }

    .swiper-button-prev,
    .swiper-button-next {
      background-color: ${theme.palette.grey[200]};

      width: auto;
      height: auto;
      padding: 10px;
      border-radius: 10px;
      --swiper-navigation-size: 35px;
    }

    ${(fadeSide === 'start' || fadeSide === 'both') &&
    css`
      :before {
        ${getEdgeFade(theme, 'left')};
        z-index: 2;
      }
    `}

    ${(fadeSide === 'end' || fadeSide === 'both') &&
    css`
      :after {
        ${getEdgeFade(theme, 'right')};
        z-index: 1;
      }
    `}
  `;
};

const getEdgeFade = (
  theme: Theme,
  edge: 'left' | 'right',
): SerializedStyles => css`
  position: absolute;
  top: 0;
  ${edge}: 0;
  width: 55px;
  height: 100%;
  content: '';
  background: linear-gradient(
    to ${edge},
    transparent 0%,
    ${theme.palette.grey[100]} 80%
  );
`;
