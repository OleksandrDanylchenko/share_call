import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

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

  const { colorStart, colorEnd, deg, centerOffset } = {
    colorStart: warning.light,
    colorEnd: primary.dark,
    deg: 30,
    centerOffset: 0,
    ...options,
  };

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

  const { blurRadius, spreadRadius, color } = {
    color: primary.main,
    blurRadius: '40px',
    spreadRadius: '2px',
    ...options,
  };

  return css`
    box-shadow: inset 0 0 ${blurRadius} ${spreadRadius} ${color};
    border: none;
  `;
};

export const blurBackgroundContainer = css`
  border-radius: 5px;
  backdrop-filter: blur(60px) hue-rotate(180deg) saturate(40%);
  border: none;
`;
