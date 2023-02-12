import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

export const page = (theme: Theme): SerializedStyles => css`
  background: linear-gradient(
    30deg,
    ${theme.palette.warning.light} -60%,
    transparent 50%,
    transparent 50%,
    ${theme.palette.primary.dark} 160%
  );
`;

export const pageContent = css`
  height: 100vh;
  gap: 7rem;
`;

export const catchphrase = css`
  font-size: 11rem;
  font-weight: 400;
`;
