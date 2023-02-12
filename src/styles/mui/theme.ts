import { createTheme } from '@mui/material/styles';
import { Poppins } from '@next/font/google';

export const poppins = Poppins({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

const defaultTheme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
    h1: {
      fontSize: '3.6rem',
      fontWeight: 800,
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 800,
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: `
          @media(min-width: 1200px) {
            max-width: 1600px;
          }
        `,
      },
    },
    MuiToolbar: {
      styleOverrides: {
        dense: {
          minHeight: '80px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          padding: '0.55em 2.2em',
          borderRadius: '30px',
          fontSize: '0.9em',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderRadius: '30px',
            borderTopLeftRadius: '10px',
          },
          fontSize: '0.9em',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          fontSize: '0.9em',
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
    MuiCard: {
      styleOverrides: {
        root: {
          width: '400px',
          height: '400px',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          height: '70px',
        },
        avatar: {
          marginRight: '10px',
        },
        title: {
          fontWeight: 700,
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          height: '230px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          height: '100px',
          paddingTop: '12px',
          paddingBottom: '12px !important', // Overrides more specific :last-child
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#3765ff',
      light: '#7f8dbf',
      dark: '#032081',
    },
    grey: {
      100: '#f1f4f6',
      200: '#e4e8f2',
      300: '#c9cfdd',
      400: '#6a6c6d',
    },
    error: {
      main: '#e81414',
    },
  },
});

export const theme = createTheme({
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    h4Primary: {
      ...defaultTheme.typography.h4,
      color: defaultTheme.palette.primary.main,
    },
  },
  components: {
    ...defaultTheme.components,
    MuiChip: {
      styleOverrides: {
        filledPrimary: {
          background: defaultTheme.palette.primary.dark,
          borderRadius: '5px',
        },
      },
    },
  },
});
