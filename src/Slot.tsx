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

const SLOT_SIZE_PX = 140;
const SLOT_CONTAINER_SIZE_PX = SLOT_SIZE_PX + 20;

const lightTheme = getTheme({mode: 'light'});
console.log('lightTheme', lightTheme);

export default function Slot({label, options, selectedIndex}: Props) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Stack spacing={0.5}>
        <Paper
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: SLOT_CONTAINER_SIZE_PX,
            justifyContent: 'center',
            width: SLOT_CONTAINER_SIZE_PX,
          }}
          variant="outlined">
          <Box
            sx={{
              alignItems: 'center',
              border: '1px solid red',
              display: 'flex',
              height: SLOT_SIZE_PX,
              justifyContent: 'center',
              padding: 2,
              textAlign: 'center',
              verticalAlign: 'middle',
              width: SLOT_SIZE_PX,
            }}>
            <Typography component="div" variant="body1">
              {
                options[
                  selectedIndex ?? Math.floor(Math.random() * options.length)
                ]
              }
            </Typography>
          </Box>
        </Paper>

        <Typography variant="subtitle2">{label}</Typography>
      </Stack>
    </ThemeProvider>
  );
}
