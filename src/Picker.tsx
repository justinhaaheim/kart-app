// import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import {useCallback, useRef, useState} from 'react';

import packageJson from '../package.json';
import blueShell from './assets/blueShell.png';
import greenShell from './assets/greenShell.png';
import mario from './assets/mario.png';
import theKartAppTitle from './assets/theKartAppTitle.png';
import wario from './assets/wario.webp';
import Slot from './Slot';
import {playRouletteSoundAsync} from './soundPlayer';

const BASE_ANIMATION_DURATION_S = 4;

// How much longer each successive slot animation should take
const SLOT_INDEX_DELAY_S = 1;

export default function Picker() {
  const [counter, setCounter] = useState(0);
  const [_isAnimating, setIsAnimating] = useState(false);
  const stopSoundsRef = useRef<() => void>();

  const onAnimationEnd = useCallback(() => {
    setIsAnimating(false);
  }, []);

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '100dvh',
          position: 'relative',
        }}>
        <Paper
          elevation={10}
          sx={{
            margin: {sm: 2, xs: 1},
            paddingX: {sm: 3, xs: 1.5},
            paddingY: {sm: 5, xs: 5},
          }}>
          <Stack spacing={3}>
            <Box>
              <img
                alt="The Kart App"
                src={theKartAppTitle}
                style={{width: '65%'}}
              />
            </Box>

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
                        {
                          emoji: '🤖',
                          imageSrc: wario,
                          label: 'Hard',
                          quantity: 1,
                        },
                      ]}
                    />
                  </Stack>
                </Box>
              );
            })}

            <Box>
              <Button
                color="primary"
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
          </Stack>
        </Paper>
      </Box>

      <Typography
        component="div"
        sx={{
          bottom: '2px',
          fontSize: 12,
          left: '50%',
          opacity: 0.1,
          position: 'absolute',
          transform: 'translateX(-50%)',
        }}>
        {`v${packageJson.version}`}
      </Typography>
    </>
  );
}
