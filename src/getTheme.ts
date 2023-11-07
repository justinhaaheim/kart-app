import {createTheme} from '@mui/material/styles';

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

const MARIO_KART_BUTTON_YELLOW = '#DBA906';

function getTheme({mode}: {mode: 'dark' | 'light'}) {
  return createTheme({
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
        main: MARIO_KART_BUTTON_YELLOW,
      },
    },
    shape: {borderRadius: 12},
    typography: {
      h1: {
        fontSize: '4rem',
      },
      h2: {fontSize: '3rem'},
    },
  });
}

export default getTheme;
