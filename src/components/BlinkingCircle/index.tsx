import { FC } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { Box, Theme } from '@mui/material';
import { merge } from 'lodash';

interface Props {
  mainColor?: string;
  secondaryColor?: string;
  size?: string;
  animate?: boolean;
}

const BlinkingCircle: FC<Props> = (props) => (
  <Box css={(theme) => blinkingStyle(theme, props)} />
);

const blinkingStyle = (theme: Theme, options: Props): SerializedStyles => {
  const { mainColor, secondaryColor, size, animate } = merge(
    {
      mainColor: theme.palette.warning.main,
      secondaryColor: theme.palette.primary.main,
      size: '1rem',
      animate: true,
    },
    options,
  );

  return css`
    display: inline-flex;
    margin: calc(${size} / 2);

    &,
    &::before {
      width: ${size};
      height: ${size};
      border-radius: 50%;
      transition: all 0.3s;
      background-color: ${secondaryColor};
    }

    &::before {
      content: '';
      position: absolute;
      background-color: ${mainColor};
      ${animate ? 'animation: blink 2s infinite;' : ''}
    }

    @keyframes blink {
      50% {
        opacity: 0;
        transform: scale(2);
      }

      100% {
        opacity: 0;
        transform: scale(2);
      }
    }
  `;
};

export default BlinkingCircle;
