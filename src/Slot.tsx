import './Slot.css';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {ThemeProvider} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import {useEffect, useRef, useState} from 'react';

import getTheme from './getTheme';

export type Item = {
  emoji: string;
  label: string;
  quantity: number;
};

type Props = {
  activated: boolean;
  label: string;
  options: Array<Item>;
  slotIndex: number;
};

function getPx(value: number): string {
  return `${value}px`;
}

const SLOT_SIZE_PX = 140;
const SLOT_MARGIN_PX = 10;
const SLOT_CONTAINER_SIZE_PX = SLOT_SIZE_PX + SLOT_MARGIN_PX * 2;

const ROUNDS_BEFORE_FINAL_RESULT = 15;
const ANIMATION_DURATION_S = 4;
const SLOT_INDEX_DELAY_S = 1;

// const BEZIER_CURVE = 'cubic-bezier(.09,.41,1,.96)';
// const BEZIER_CURVE = 'cubic-bezier(.02,.99,.97,.89)';
// const BEZIER_CURVE = 'cubic-bezier(.31,1.1,.97,.89)';
const BEZIER_CURVE = 'cubic-bezier(.31,1.1,.98,.95)';

const lightTheme = getTheme({mode: 'light'});

type Status = 'ended' | 'ready' | 'transitioning';

export default function Slot({label, options, slotIndex, activated}: Props) {
  const [_status, setStatus] = useState<Status>('ready');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const tallBoxRef = useRef<HTMLElement>(null);

  const animationDurationAdjusted =
    ANIMATION_DURATION_S + SLOT_INDEX_DELAY_S * slotIndex;

  const optionsComponents = options
    .map((option, _index) => {
      // Return an array of the number of items, and then flatten the resulting array
      return Array.from({length: option.quantity}, () => {
        return (
          <Stack spacing={0.5}>
            <Typography component="div" variant="h2">
              {option.emoji}
            </Typography>
            <Typography component="div" variant="h6">
              {option.label}
            </Typography>
          </Stack>
        );
      });
    })
    .flat();

  // useEffect(() => {
  //   console.log('status:', status);
  // }, [status]);

  useEffect(() => {
    if (activated && selectedIndex == null) {
      setSelectedIndex(_.random(0, optionsComponents.length - 1));
    }
    if (!activated && selectedIndex != null) {
      setSelectedIndex(null);
      setStatus('ready');
    }
  }, [activated, optionsComponents.length, selectedIndex]);

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
                selectedIndex != null
                  ? `translateY(-${
                      SLOT_SIZE_PX *
                        optionsComponents.length *
                        ROUNDS_BEFORE_FINAL_RESULT +
                      selectedIndex * SLOT_SIZE_PX
                    }px)`
                  : 'translateY(0)',
              transition:
                selectedIndex != null
                  ? `transform ${animationDurationAdjusted}s ${BEZIER_CURVE}`
                  : 'none',
            }}>
            {Array.from({length: ROUNDS_BEFORE_FINAL_RESULT + 1})
              .fill(optionsComponents)
              .flat()
              .map((option, index) => (
                <Box
                  key={index}
                  sx={{
                    alignItems: 'center',

                    // backgroundColor:
                    //   index % 2 === 0 ? 'primary.main' : 'secondary.main',

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
                          animationDuration: `${animationDurationAdjusted}s`,
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
