import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

import { blurBackgroundContainer } from '@/styles/mixins';

export const joinFormWrapper = (theme: Theme): SerializedStyles =>
  css`
    width: 500px;
    height: 400px;
    flex-shrink: 0;
    ${blurBackgroundContainer(theme)};
  `;

export const nameForm = (theme: Theme): SerializedStyles => css`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};

  .MuiInputBase-root {
    color: ${theme.palette.primary.dark};
    font-size: 1.3rem;

    input {
      -webkit-text-fill-color: ${theme.palette.primary.dark} !important;
    }
  }
`;
