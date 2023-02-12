import { css, SerializedStyles } from '@emotion/react';
import { Theme } from '@mui/material';

export const headerStyles = (theme: Theme): SerializedStyles => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.palette.background.paper};
`;

export const headerLinks = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 90px;
`;

export const headerSubPagesLinks = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
`;

export const subPageLink = (theme: Theme): SerializedStyles => css`
  position: relative;
  color: ${theme.palette.text.primary};
  font-weight: 500;
  font-size: 1.1rem;
`;

export const activeLinkDecorationStyles = (theme: Theme): SerializedStyles => {
  const { minHeight: toolbarHeight } = theme.components?.MuiToolbar
    ?.styleOverrides?.dense as {
    minHeight: string;
  };
  const bottomOffsetCoefficient = 0.34;

  return css`
    position: absolute;
    width: 130%;
    left: -15%;
    bottom: calc(${toolbarHeight} * ${bottomOffsetCoefficient} * -1);
    border-bottom: 2px solid ${theme.palette.primary.main};
  `;
};
