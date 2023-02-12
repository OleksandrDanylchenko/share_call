import React, { FC } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { Box } from '@mui/material';

interface Props {
  strings: string[];
  infinite?: boolean;
  duration?: number;
}

/**
 * Heavily inspired by https://keenanpayne.com/rotating-text-css-animation/
 */
const StringsRotator: FC<Props> = (props) => {
  const { strings, infinite = false, duration = 2 } = props;

  return (
    <span css={rotateWrapper}>
      <Box css={placeholder} textAlign={{ md: 'center', lg: 'left' }}>
        {/* Takes a line of space */}
        &nbsp;
      </Box>
      {strings.map((str, index, arr) => {
        const isLast = index === arr.length - 1;
        return (
          <span
            key={`${str}${index}`}
            css={() => rotateString({ index, isLast, duration, infinite })}
          >
            {str}
          </span>
        );
      })}
    </span>
  );
};

const rotateWrapper = css`
  position: relative;
`;

const placeholder = css`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

const rotateString = (options: {
  index: number;
  isLast: boolean;
  duration: Props['duration'];
  infinite: Props['infinite'];
}): SerializedStyles => {
  const { index, isLast, duration, infinite } = options;

  return css`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    opacity: 0;

    animation-name: ${isLast ? 'rotate-last' : 'rotate'};
    animation-duration: ${duration}s;
    animation-delay: ${index * duration!}s;
    animation-fill-mode: ${isLast && !infinite ? 'forwards' : 'none'};

    @keyframes rotate {
      0% {
        opacity: 0;
        transform: translate3d(0, 50px, 0);
      }

      20%,
      80% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }

      100% {
        opacity: 0;
        transform: translate3d(0, -25px, 0);
      }
    }

    @keyframes rotate-last {
      0% {
        opacity: 0;
        transform: translate3d(0, 50px, 0);
      }

      50%,
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
  `;
};

export default StringsRotator;
