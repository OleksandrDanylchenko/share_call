import { CSSProperties } from 'react';

import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    h4Primary: CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    h4Primary?: CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h4Primary: true;
  }
}

import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends MuiTheme {}
}
