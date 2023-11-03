// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {useState} from 'react';

import Slot from './Slot';

export default function Picker() {
  const [itemsSelectedIndex, setItemsSelectedIndex] = useState<number | null>(
    null,
  );

  return (
    <Paper sx={{padding: 3}}>
      <Stack spacing={3}>
        <Typography variant="h2">The Kart App</Typography>

        <Box sx={{padding: 5}}>
          <Stack direction="row" justifyContent="center" spacing={3}>
            <Slot
              label="Items"
              options={['Normal', 'Frantic']}
              selectedIndex={null}
            />
            <Slot
              label="CPU"
              options={['Normal', 'Hard']}
              selectedIndex={null}
            />
          </Stack>
        </Box>

        <Box>
          <Button
            onClick={() =>
              setItemsSelectedIndex((prev) => (prev === null ? 0 : null))
            }
            variant="contained">
            Let's Go!
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
