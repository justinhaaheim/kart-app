// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import {useState} from 'react';

import Slot from './Slot';

const ITEMS: Array<string> = (
  Array.from({length: 2}).fill('Normal') as Array<string>
).concat(['Frantic']);

export default function Picker() {
  const [activated, setActivated] = useState(false);

  return (
    <Paper sx={{padding: 3}}>
      <Stack spacing={3}>
        <Typography variant="h2">The Kart App</Typography>

        <Box sx={{padding: 5}}>
          <Stack direction="row" justifyContent="center" spacing={3}>
            <Slot
              activated={activated}
              label="Items"
              options={[
                {emoji: '🙂', label: 'Normal', quantity: 2},
                {emoji: '😳', label: 'Frantic', quantity: 1},
              ]}
              slotIndex={0}
            />
            <Slot
              activated={activated}
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
            onClick={() => setActivated((prev) => !prev)}
            variant="contained">
            Let's Go!
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
