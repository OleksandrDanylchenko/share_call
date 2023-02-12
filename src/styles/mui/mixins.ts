import { css } from '@emotion/react';

export const unlabeledTextField = css`
  // Dev should provide a label for accessibility manually
  .MuiInputLabel-root {
    display: none;
  }

  .MuiInputBase-input {
    padding-top: 16px;
    padding-bottom: 16px;
  }
`;
