import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {ThemeProvider} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import getTheme from './getTheme';

type Props = {
  label: string;
  options: Array<React.ReactNode>;
  selectedIndex: number | null;
};

const lightTheme = getTheme({mode: 'light'});
console.log('lightTheme', lightTheme);

export default function Slot({label, options, selectedIndex}: Props) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Stack spacing={0.5}>
        <Paper
          sx={{
            // backgroundColor: '#fff',
            padding: 2,
          }}
          variant="outlined">
          {options[selectedIndex ?? Math.floor(Math.random() * options.length)]}
        </Paper>
        <Typography variant="subtitle2">{label}</Typography>
      </Stack>
    </ThemeProvider>
  );
}
