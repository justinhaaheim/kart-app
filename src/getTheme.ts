import {createTheme, responsiveFontSizes} from '@mui/material/styles';

// function getHtmlFontSize(): number | null {
//   let fontSize: number | null = null;
//   try {
//     // NOTE: Even when this is not explicitly set it still returns a value
//     const fontSizeString = window
//       .getComputedStyle(document.getElementsByTagName('html')[0])
//       .getPropertyValue('font-size');
//     fontSize = parseInt(fontSizeString, 10);
//   } catch (e) {
//     console.error('Error getting font size', e);
//   }

//   return fontSize;
// }

// const htmlFontSize = getHtmlFontSize();

// const htmlFontSizeObject =
//   htmlFontSize == null ? {} : {htmlFontSize: htmlFontSize};

// const MARIO_KART_BUTTON_YELLOW = '#DBA906';
const NINTENDO_RED = 'rgb(230, 0, 18)';

function getTheme({mode}: {mode: 'dark' | 'light'}) {
  return responsiveFontSizes(
    createTheme({
      palette: {
        background: {default: mode === 'light' ? '#F6F6F6' : undefined},
        mode: mode,
        primary: {
          // contrastText: '#242105',
          // dark: '#A29415',
          // light: '#E9DB5D',
          // main: '#E3D026',
          // dark: MARIO_KART_BUTTON_YELLOW,
          // light: MARIO_KART_BUTTON_YELLOW,
          main: NINTENDO_RED,
        },
      },
      shape: {borderRadius: 12},
      typography: {
        fontFamily: [
          'Helvetica Neue',
          'Roboto',
          '-apple-system',
          'sans-serif',
        ].join(','),
        h1: {
          fontSize: '4rem',
        },
        h2: {fontSize: '3rem'},
      },
    }),
    // {factor: 2},
  );
}

export default getTheme;
