import { css, SerializedStyles } from '@emotion/react';
import { alpha, Theme } from '@mui/material';
import { merge } from 'lodash';

export const fullViewport = css`
  width: 100vw;
  height: 100vh;
`;

export const fullWidth = css`
  width: 100%;
`;

export const fullHeight = css`
  height: 100%;
`;

export const fullParent = css`
  ${fullWidth};
  ${fullHeight};
`;

export const doubleColorGradient = (
  theme: Theme,
  options: {
    colorStart?: string;
    colorEnd?: string;
    deg?: number;
    centerOffset?: number; // How far from the center the gradient should be
  } = {},
): SerializedStyles => {
  const {
    palette: { warning, primary },
  } = theme;

  const { colorStart, colorEnd, deg, centerOffset } = merge(
    {
      colorStart: warning.light,
      colorEnd: primary.dark,
      deg: 30,
      centerOffset: 0,
    },
    options,
  );

  return css`
    background: linear-gradient(
      ${deg}deg,
      ${colorStart} -60%,
      transparent ${50 - centerOffset}%,
      transparent ${50 + centerOffset}%,
      ${colorEnd} 160%
    );
  `;
};

export const shadowBorder = (
  theme: Theme,
  options: { blurRadius?: string; spreadRadius?: string; color?: string } = {},
): SerializedStyles => {
  const {
    palette: { primary },
  } = theme;

  const { blurRadius, spreadRadius, color } = merge(
    { color: primary.main, blurRadius: '10px', spreadRadius: '2px' },
    options,
  );

  return css`
    box-shadow: inset 0 0 ${blurRadius} ${spreadRadius} ${color};
    border: none;

    &.Mui-disabled {
      border: none;
    }
  `;
};

export const blurBackgroundContainer = css`
  border-radius: 5px;
  backdrop-filter: blur(60px) hue-rotate(180deg) saturate(40%);
  border: none;
  background: none;
`;

export const lightBackgroundContainer = (
  theme: Theme,
  options: { active: boolean } = { active: false },
): SerializedStyles =>
  css`
    background-color: ${alpha(
      options.active ? theme.palette.warning.main : theme.palette.primary.main,
      0.1,
    )};
  `;

export const textFieldEllipsis = css`
  .MuiInputBase-input {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const lineClamp = (linesNumber = 2): SerializedStyles => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${linesNumber};
  overflow: hidden;
`;
