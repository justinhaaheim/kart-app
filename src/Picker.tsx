// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import {useRef, useState} from 'react';

import blueShell from './assets/blueShell.png';
import greenShell from './assets/greenShell.png';
import mario from './assets/mario.png';
import wario from './assets/wario.webp';
import Slot from './Slot';
import {playRouletteSound} from './soundPlayer';

const BASE_ANIMATION_DURATION_S = 4;

// How much longer each successive slot animation should take
const SLOT_INDEX_DELAY_S = 1;

export default function Picker() {
  const [counter, setCounter] = useState(0);
  const stopSoundsRef = useRef<() => void>();

  return (
    <Paper sx={{padding: 3}}>
      <Stack spacing={3}>
        <Typography variant="h2">The Kart App</Typography>

        <Box sx={{padding: 5}}>
          <Stack direction="row" justifyContent="center" spacing={3}>
            <Slot
              activated={counter !== 0}
              animationDuration={BASE_ANIMATION_DURATION_S}
              key={`Items-${counter}`}
              label="Items"
              options={[
                {
                  emoji: '🙂',
                  imageSrc: greenShell,
                  label: 'Normal',
                  quantity: 2,
                },
                {
                  emoji: '😳',
                  imageSrc: blueShell,
                  label: 'Frantic',
                  quantity: 1,
                },
              ]}
            />

            <Slot
              activated={counter !== 0}
              animationDuration={BASE_ANIMATION_DURATION_S + SLOT_INDEX_DELAY_S}
              key={`CPU-${counter}`}
              label="CPU"
              options={[
                {emoji: '😌', imageSrc: mario, label: 'Normal', quantity: 3},
                {emoji: '🤖', imageSrc: wario, label: 'Hard', quantity: 1},
              ]}
            />
          </Stack>
        </Box>

        <Box>
          <Button
            onClick={async () => {
              setCounter((prev) => prev + 1);
              if (stopSoundsRef.current != null) {
                stopSoundsRef.current();
              }
              const {stop} = await playRouletteSound(
                BASE_ANIMATION_DURATION_S + SLOT_INDEX_DELAY_S,
              );
              stopSoundsRef.current = stop;
            }}
            size="large"
            variant="contained">
            Let's-a-go!
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
