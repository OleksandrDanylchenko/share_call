import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

export const signInPageStyles = (theme: Theme): SerializedStyles => css`
  position: relative;
  width: 100vw;
  height: 100vh;

  background: ${theme.palette.primary.dark};
`;

export const backgroundStyles = css`
  object-fit: cover;
  //box-shadow: inset 0 0 99999px rgba(43, 116, 194, 0.5);
  opacity: 0.7;
  filter: blur(4px);
`;

export const signInFormWrapperStyles = (theme: Theme): SerializedStyles => css`
  padding: 6rem 4rem 5rem;
  width: 500px;
  border-radius: 20px;
  z-index: 1;
  background-color: ${theme.palette.background.paper};
`;

export const signInFormStyles = css`
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
`;

export const leftAlignedStyles = css`
  align-self: flex-start;
`;
