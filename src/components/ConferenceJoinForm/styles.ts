import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

export const joinFormContainer = (theme: Theme): SerializedStyles =>
  css`
    width: 500px;
    height: 400px;
    flex-shrink: 0;

    border-radius: 5px;
    backdrop-filter: blur(60px) hue-rotate(180deg) saturate(40%);
    padding: ${theme.spacing(4, 6)};
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
