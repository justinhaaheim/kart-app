// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const slotSx = {
  padding: 2,
};

export default function Picker() {
  return (
    <Paper sx={{padding: 3}}>
      <Stack spacing={3}>
        <Typography variant="h2">The Kart App</Typography>

        <Stack direction="row" justifyContent="center" spacing={3}>
          <Paper sx={slotSx} variant="outlined">
            Thing 1
          </Paper>
          <Paper sx={slotSx} variant="outlined">
            Thing 2
          </Paper>
        </Stack>

        <Box>
          <Button variant="contained">Roll the dice</Button>
        </Box>
      </Stack>
    </Paper>
  );
}
