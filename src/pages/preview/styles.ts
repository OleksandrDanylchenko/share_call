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
