import './Slot.css';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {ThemeProvider} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {useEffect, useRef, useState} from 'react';

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

const ROUNDS_BEFORE_FINAL_RESULT = 15;
const ANIMATION_DURATION_S = 4;

// const BEZIER_CURVE = 'cubic-bezier(.09,.41,1,.96)';
// const BEZIER_CURVE = 'cubic-bezier(.02,.99,.97,.89)';
// const BEZIER_CURVE = 'cubic-bezier(.31,1.1,.97,.89)';
const BEZIER_CURVE = 'cubic-bezier(.31,1.1,.98,.95)';

const lightTheme = getTheme({mode: 'light'});

type Status = 'ended' | 'ready' | 'transitioning';

export default function Slot({label, options, selectedIndex}: Props) {
  const [_status, setStatus] = useState<Status>('ready');
  const tallBoxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (tallBoxRef.current != null) {
      const tallBoxPointer = tallBoxRef.current;
      const onTransitionStart = () => setStatus('transitioning');
      const onTransitionEnd = () => setStatus('ended');

      tallBoxPointer.addEventListener('transitionstart', onTransitionStart);
      tallBoxPointer.addEventListener('transitionend', onTransitionEnd);

      return () => {
        tallBoxPointer?.removeEventListener(
          'transitionstart',
          onTransitionStart,
        );
        tallBoxPointer?.removeEventListener('transitionend', onTransitionEnd);
      };
    } else {
      console.error('tallBoxRef.current is null');
      return;
    }
  }, []);

  return (
    <Stack spacing={0.5}>
      <ThemeProvider theme={lightTheme}>
        <Paper
          sx={{
            height: getPx(SLOT_CONTAINER_SIZE_PX),
            overflow: 'hidden',
            padding: getPx(SLOT_MARGIN_PX),
            width: getPx(SLOT_CONTAINER_SIZE_PX),
          }}
          variant="outlined">
          <Box
            ref={tallBoxRef}
            sx={{
              display: 'block',
              transform:
                selectedIndex == null
                  ? 'translateY(0)'
                  : `translateY(-${
                      SLOT_SIZE_PX *
                        options.length *
                        ROUNDS_BEFORE_FINAL_RESULT +
                      selectedIndex * SLOT_SIZE_PX
                    }px)`,
              transition:
                selectedIndex != null
                  ? `transform ${ANIMATION_DURATION_S}s ${BEZIER_CURVE}`
                  : 'none',
            }}>
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
                    // filter: selectedIndex != null ? 'blur(3px)' : 'blur(0)',
                    height: getPx(SLOT_SIZE_PX),

                    justifyContent: 'center',

                    textAlign: 'center',
                    // transition:
                    //   selectedIndex != null
                    //     ? `filter ${ANIMATION_DURATION_S} ${BEZIER_CURVE}`
                    //     : 'none',
                    verticalAlign: 'middle',
                    width: getPx(SLOT_SIZE_PX),
                    ...(selectedIndex != null
                      ? {
                          animationDuration: `${ANIMATION_DURATION_S}s`,
                          animationName: 'slot-blur',
                        }
                      : {}),
                  }}>
                  <Typography component="div" variant="body1">
                    {option as string}
                  </Typography>
                </Box>
              ))}
          </Box>
        </Paper>
      </ThemeProvider>

      <Typography variant="subtitle2">{label}</Typography>
    </Stack>
  );
}
