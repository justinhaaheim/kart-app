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

const ROUNDS_BEFORE_FINAL_RESULT = 10;

const lightTheme = getTheme({mode: 'light'});
console.log('lightTheme', lightTheme);

export default function Slot({label, options, selectedIndex}: Props) {
  return (
    <Stack spacing={0.5}>
      <ThemeProvider theme={lightTheme}>
        <Paper
          sx={{
            display: 'block',
            height: getPx(SLOT_CONTAINER_SIZE_PX),
            // overflow: 'hidden',
            padding: getPx(SLOT_MARGIN_PX),
            transform:
              selectedIndex == null
                ? 'translateY(0)'
                : `translateY(-${
                    SLOT_SIZE_PX * 2 * ROUNDS_BEFORE_FINAL_RESULT +
                    selectedIndex * SLOT_SIZE_PX
                  }px)`,
            transition: 'transform 1s ease-in-out',
            width: getPx(SLOT_CONTAINER_SIZE_PX),
          }}
          variant="outlined">
          {Array.from({length: ROUNDS_BEFORE_FINAL_RESULT + 1})
            .fill(options)
            .flat()
            .map((option, index) => (
              <Box
                key={index}
                sx={{
                  alignItems: 'center',
                  backgroundColor:
                    index % 2 === 0 ? 'primary.main' : 'secondary.main',
                  display: 'flex',
                  height: getPx(SLOT_SIZE_PX),
                  justifyContent: 'center',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  width: getPx(SLOT_SIZE_PX),
                }}>
                <Typography component="div" variant="body1">
                  {option as string}
                </Typography>
              </Box>
            ))}
        </Paper>
      </ThemeProvider>

      <Typography variant="subtitle2">{label}</Typography>
    </Stack>
  );
}
