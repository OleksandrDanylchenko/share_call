import { CSSProperties } from 'react';

import { Theme as MuiTheme } from '@mui/material/styles';
import '@emotion/react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    monospace: CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    monospace?: CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    monospace: true;
  }
}

declare module '@emotion/react' {
  export interface Theme extends MuiTheme {}
}
