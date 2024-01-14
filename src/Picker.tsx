// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import {useCallback, useRef, useState} from 'react';

import blueShell from './assets/blueShell.png';
import greenShell from './assets/greenShell.png';
import mario from './assets/mario.png';
import wario from './assets/wario.webp';
import {playSilentHTMLAudio} from './playSilentHTMLAudio';
import Slot from './Slot';
import {
  playRouletteSoundAsync,
  // playRouletteSoundSync,
  resumeAudioContext,
} from './soundPlayer';

const BASE_ANIMATION_DURATION_S = 4;

// How much longer each successive slot animation should take
const SLOT_INDEX_DELAY_S = 1;

export default function Picker() {
  const [counter, setCounter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const stopSoundsRef = useRef<() => void>();

  const onAnimationEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return (
    <Paper
      elevation={10}
      sx={{
        margin: {sm: 2, xs: 0.5},
        paddingX: {sm: 3, xs: 1.5},
        paddingY: {sm: 5, xs: 4},
      }}>
      <Stack spacing={3}>
        <Typography variant="h2">The Kart App</Typography>

        {[0, 1].map((n) => {
          const idNumber = counter + n;
          // We don't ever want the first one activated since it's just a placeholder
          const activated = n === 0 && counter !== 0;
          return (
            <Box
              key={idNumber}
              sx={{padding: 5, ...(n === 1 ? {display: 'none'} : {})}}>
              <Stack direction="row" justifyContent="center" spacing={3}>
                <Slot
                  activated={activated}
                  animationDuration={BASE_ANIMATION_DURATION_S}
                  // key={`Items-${counter}`}
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
                  activated={activated}
                  // activated={counter !== 0}
                  animationDuration={
                    BASE_ANIMATION_DURATION_S + SLOT_INDEX_DELAY_S
                  }
                  label="CPU"
                  // key={`CPU-${counter}`}
                  onAnimationEnd={onAnimationEnd}
                  options={[
                    {
                      emoji: '😌',
                      imageSrc: mario,
                      label: 'Normal',
                      quantity: 3,
                    },
                    {emoji: '🤖', imageSrc: wario, label: 'Hard', quantity: 1},
                  ]}
                />
              </Stack>
            </Box>
          );
        })}

        <Box>
          <Button
            color={isAnimating ? 'secondary' : 'primary'}
            onClick={() => {
              setIsAnimating(true);
              setCounter((prev) => prev + 1);
              if (stopSoundsRef.current != null) {
                console.log('stopping sounds');
                stopSoundsRef.current();
              }

              playRouletteSoundAsync(
                BASE_ANIMATION_DURATION_S + SLOT_INDEX_DELAY_S,
              ).then(({stop}) => {
                stopSoundsRef.current = stop;
              });
            }}
            size="large"
            sx={{border: '5px solid #fafafa', borderRadius: 1000}}
            variant="contained">
            Let's-a-go!
          </Button>
        </Box>
        <Box>
          <Button
            onClick={async () => {
              await resumeAudioContext();
              playSilentHTMLAudio();
            }}
            size="large"
            sx={{border: '5px solid #fafafa', borderRadius: 1000}}
            variant="contained">
            Resume Audio Context
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
