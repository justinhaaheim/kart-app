import './Slot.css';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import {ThemeProvider, useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import _ from 'lodash';
import {useEffect, useRef, useState} from 'react';

import getTheme from './getTheme';

export type Item = {
  emoji: string;
  imageSrc: string;
  label: string;
  quantity: number;
};

type Props = {
  activated: boolean;
  animationDuration: number;
  label: string;
  onAnimationEnd?: () => void;
  options: Array<Item>;
};

function getPx(value: number): string {
  return `${value}px`;
}

const SLOT_SIZE_PX = 140;
const SLOT_MARGIN_PX = 10;

const SLOT_SIZE_SMALL_PX = 95;
const SLOT_MARGIN_SMALL_PX = 6;

const ROUNDS_BEFORE_FINAL_RESULT = 15;

// const BEZIER_CURVE = 'cubic-bezier(.09,.41,1,.96)';
// const BEZIER_CURVE = 'cubic-bezier(.02,.99,.97,.89)';
// const BEZIER_CURVE = 'cubic-bezier(.31,1.1,.97,.89)';
// const BEZIER_CURVE = 'cubic-bezier(.31,1.1,.98,.95)'; // I really like this one
const BEZIER_CURVE = 'cubic-bezier(.31,1.1,.99,.98)'; // This one's even better!

const lightTheme = getTheme({mode: 'light'});

type Status = 'ended' | 'ready' | 'transitioning' | 'unpainted';

export default function Slot({
  label,
  animationDuration,
  options,
  activated,
  onAnimationEnd,
}: Props) {
  const [status, setStatus] = useState<Status>('unpainted');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const tallBoxRef = useRef<HTMLElement>(null);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const slotSizePx = isLargeScreen ? SLOT_SIZE_PX : SLOT_SIZE_SMALL_PX;
  const slotMarginPx = isLargeScreen ? SLOT_MARGIN_PX : SLOT_MARGIN_SMALL_PX;

  /**
   * Once the animation is complete we want to disable the transition altogether because
   * we don't want anything re-animating after the slot has landed on its final position.
   *
   * This re-animating will happen if the user's browser changes size and our media query above (isLargeScreen)
   * changes, which causes a partial re-animation as the slot adapts to the new sizes.
   */
  const transitionEnabled = selectedIndex != null && status !== 'ended';

  const slotContainerSizePx = slotSizePx + slotMarginPx * 2;

  const imgMaxHeightPx = Math.floor(slotSizePx * 0.54);

  const optionsComponentsUncut = options
    .map((option, _index) => {
      // Return an array of the number of items, and then flatten the resulting array
      return Array.from({length: option.quantity}, () => {
        return (
          <Stack
            spacing={0.5}
            sx={{alignItems: 'center', justifyContent: 'center'}}>
            <img
              alt={option.label}
              src={option.imageSrc}
              style={{
                height: 'auto',
                // border: '1px solid red',
                maxHeight: `${imgMaxHeightPx}px`,
                maxWidth: `${imgMaxHeightPx}px`,
                width: 'auto',
                // maxWidth: '75px',
              }}
            />
            <Typography component="div" variant="h6">
              {option.label}
            </Typography>
          </Stack>
        );
      });
    })
    .flat();

  const startingItemIndexRef = useRef<number>(
    _.random(0, optionsComponentsUncut.length - 1),
  );

  const optionsComponents = optionsComponentsUncut
    .slice(startingItemIndexRef.current)
    .concat(optionsComponentsUncut.slice(0, startingItemIndexRef.current));

  useEffect(() => {
    if (activated && status === 'unpainted' && tallBoxRef.current != null) {
      // This is for to force a repaint,
      // which is necessary in order to transition styles when adding a class name.
      // Otherwise on ios safari (and maybe other browsers) the initial
      // translateY won't be set, and no scrolling animation will happen.
      // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
      tallBoxRef.current.scrollTop;
      setStatus('ready');
    }

    if (activated && status === 'ready' && selectedIndex == null) {
      setSelectedIndex(_.random(0, optionsComponents.length - 1));
    }

    // // Reset if we've already been activated before
    // if (!activated && selectedIndex != null) {
    //   setSelectedIndex(null);
    //   setStatus('ready');
    // }
  }, [activated, optionsComponents.length, selectedIndex, status]);

  useEffect(() => {
    if (tallBoxRef.current != null) {
      const tallBoxPointer = tallBoxRef.current;
      const onTransitionStart = () => setStatus('transitioning');
      const onTransitionEnd = () => {
        setStatus('ended');
        if (onAnimationEnd != null) {
          onAnimationEnd();
        }
      };

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
  }, [onAnimationEnd]);

  return (
    <Stack spacing={0.5}>
      <ThemeProvider theme={lightTheme}>
        <Paper
          sx={{
            height: getPx(slotContainerSizePx),
            overflow: 'hidden',
            padding: getPx(slotMarginPx),
            width: getPx(slotContainerSizePx),
          }}
          variant="outlined">
          <Box
            ref={tallBoxRef}
            sx={{
              display: 'block',
              transform:
                selectedIndex != null
                  ? `translateY(-${
                      slotSizePx *
                        optionsComponents.length *
                        ROUNDS_BEFORE_FINAL_RESULT +
                      selectedIndex * slotSizePx
                    }px)`
                  : 'translateY(0)',
              transition: transitionEnabled
                ? `transform ${animationDuration}s ${BEZIER_CURVE}`
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
                    height: getPx(slotSizePx),

                    justifyContent: 'center',

                    textAlign: 'center',
                    // transition:
                    //   selectedIndex != null
                    //     ? `filter ${ANIMATION_DURATION_S} ${BEZIER_CURVE}`
                    //     : 'none',
                    verticalAlign: 'middle',
                    width: getPx(slotSizePx),
                    ...(selectedIndex != null
                      ? {
                          animationDuration: `${animationDuration}s`,
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

      <Typography variant="h6">{label}</Typography>
    </Stack>
  );
}
