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

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  shape: {borderRadius: 12},
});

export default theme;
