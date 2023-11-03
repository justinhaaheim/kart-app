// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import {useState} from 'react';

import Slot from './Slot';

export default function Picker() {
  const [counter, setCounter] = useState(0);

  return (
    <Paper sx={{padding: 3}}>
      <Stack spacing={3}>
        <Typography variant="h2">The Kart App</Typography>

        <Box sx={{padding: 5}}>
          <Stack direction="row" justifyContent="center" spacing={3}>
            <Slot
              activated={counter !== 0}
              key={`Items-${counter}`}
              label="Items"
              options={[
                {emoji: '🙂', label: 'Normal', quantity: 2},
                {emoji: '😳', label: 'Frantic', quantity: 1},
              ]}
              slotIndex={0}
            />
            <Slot
              activated={counter !== 0}
              key={`CPU-${counter}`}
              label="CPU"
              options={[
                {emoji: '😌', label: 'Normal', quantity: 3},
                {emoji: '🤖', label: 'Hard', quantity: 1},
              ]}
              slotIndex={1}
            />
          </Stack>
        </Box>

        <Box>
          <Button
            onClick={() => setCounter((prev) => prev + 1)}
            variant="contained">
            Let's Go!
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
