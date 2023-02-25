import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

export const fullHeight = css`
  height: 100%;
`;

export const viewportHeight = css`
  height: 100vh;
`;

export const doubleColorGradient = (
  theme: Theme,
  options?: { colorStart?: string; colorEnd?: string; deg?: number },
): SerializedStyles => {
  const {
    palette: { warning, primary },
  } = theme;

  const { colorStart, colorEnd, deg } = options || {
    colorStart: warning.light,
    colorEnd: primary.dark,
    deg: 30,
  };

  return css`
    background: linear-gradient(
      ${deg}deg,
      ${colorStart} -60%,
      transparent 50%,
      transparent 50%,
      ${colorEnd} 160%
    );
  `;
};

export const blurBackgroundContainer = (theme: Theme): SerializedStyles => css`
  border-radius: 5px;
  backdrop-filter: blur(60px) hue-rotate(180deg) saturate(40%);
  padding: ${theme.spacing(4, 6)};
`;
