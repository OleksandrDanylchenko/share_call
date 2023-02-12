import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

export const logoStyles = css`
  position: absolute;
  top: 40px;
  left: 40px;
`;

export const notFoundContainer = css`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

export const messageContainerStyles = css`
  min-width: 340px;
`;

export const brokenCarStyles = css`
  width: 100%;
`;

export const headerErrorStyles = css`
  font-size: 10rem;
  margin-bottom: 17px;
`;

export const dividerStyles = (theme: Theme): SerializedStyles => css`
  width: 30%;
  border-color: ${theme.palette.primary.main};
  border-width: 1px;
  margin-bottom: 37px;
`;

export const messageStyles = css`
  margin-bottom: 20px;
`;

export const circleDecorStyles = css`
  position: absolute;
  left: -70px;
`;
