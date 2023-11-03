import Box from '@mui/material/Box';
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

function getPx(value: number): string {
  return `${value}px`;
}

const SLOT_SIZE_PX = 140;
const SLOT_MARGIN_PX = 10;
const SLOT_CONTAINER_SIZE_PX = SLOT_SIZE_PX + SLOT_MARGIN_PX * 2;

const lightTheme = getTheme({mode: 'light'});
console.log('lightTheme', lightTheme);

export default function Slot({label, options, selectedIndex}: Props) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Stack spacing={0.5}>
        <Paper
          sx={{
            display: 'block',
            height: getPx(SLOT_CONTAINER_SIZE_PX),
            overflow: 'hidden',
            padding: getPx(SLOT_MARGIN_PX),
            width: getPx(SLOT_CONTAINER_SIZE_PX),
          }}
          variant="outlined">
          {options.map((option, index) => (
            <Box
              key={index}
              sx={{
                alignItems: 'center',
                border: '1px solid red',
                display: 'flex',
                height: getPx(SLOT_SIZE_PX),
                justifyContent: 'center',
                // padding: 2,
                textAlign: 'center',
                verticalAlign: 'middle',
                width: getPx(SLOT_SIZE_PX),
              }}>
              <Typography component="div" variant="body1">
                {option}
              </Typography>
            </Box>
          ))}
        </Paper>

        <Typography variant="subtitle2">{label}</Typography>
      </Stack>
    </ThemeProvider>
  );
}
