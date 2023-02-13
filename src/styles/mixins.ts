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
  options?: { deg?: number },
): SerializedStyles => {
  const { deg } = options || { deg: 30 };

  return css`
    background: linear-gradient(
      ${deg}deg,
      ${theme.palette.warning.light} -60%,
      transparent 50%,
      transparent 50%,
      ${theme.palette.primary.dark} 160%
    );
  `;
};

export const blurBackgroundContainer = (theme: Theme): SerializedStyles => css`
  border-radius: 5px;
  backdrop-filter: blur(60px) hue-rotate(180deg) saturate(40%);
  padding: ${theme.spacing(4, 6)};
`;
