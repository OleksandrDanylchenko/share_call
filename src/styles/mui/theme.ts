import { createTheme } from '@mui/material/styles';
import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const defaultTheme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
    h4: {
      fontSize: '2.5rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          padding: '0.55em 2.2em',
          borderRadius: '30px',
          fontSize: '0.96em',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          width: '100%',
          color: '#c9cfdd',
          marginTop: '5px',
          marginBottom: '5px',
          fontSize: '0.9em',
        },
        vertical: {
          width: 'auto',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
  },
});

export const theme = createTheme({
  ...defaultTheme,
  components: {
    ...defaultTheme.components,
    MuiCssBaseline: {
      styleOverrides: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 100px ${defaultTheme.palette.grey[700]} inset !important;
        }
      `,
    },
  },
});
