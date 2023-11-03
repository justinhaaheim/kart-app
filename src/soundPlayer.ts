import r1 from './assets/SE_SYS_CourseSelectRoulette1.wav';
import r2 from './assets/SE_SYS_CourseSelectRoulette2.wav';
import r3 from './assets/SE_SYS_CourseSelectRoulette3.wav';
import r4 from './assets/SE_SYS_CourseSelectRoulette4.wav';
import r5 from './assets/SE_SYS_CourseSelectRoulette5.wav';
import r6 from './assets/SE_SYS_CourseSelectRoulette6.wav';
import r7 from './assets/SE_SYS_CourseSelectRoulette7.wav';
import r8 from './assets/SE_SYS_CourseSelectRoulette8.wav';
import rDecide from './assets/SE_SYS_CourseSelectRouletteDecide.wav';

const SHORT_DELAY_MS = 100;
const LONG_DELAY_MS = 300;

const FINAL_DELAY_MS = 1000;
const SLOWER_SECTION_DURATION_MS = 2600;

const rouletteSounds = [r1, r2, r3, r4, r5, r6, r7, r8];

function playSoundsWithDelay(
  delayMs: number,
  counterRef: {current: number},
): number {
  const interval = setInterval(() => {
    const a = new Audio(
      rouletteSounds[counterRef.current % rouletteSounds.length],
    );
    a.play();
    counterRef.current += 1;
  }, delayMs);
  return interval;
}

export function playRouletteSound(durationSeconds: number) {
  // const audio = new Audio('/roulette.mp3');

  const durationMs = durationSeconds * 1000;

  const counterRef = {current: 0};

  let interval = playSoundsWithDelay(SHORT_DELAY_MS, counterRef);
  // const interval = setInterval(() => {
  //   const a = new Audio(rouletteSounds[counter % rouletteSounds.length]);
  //   a.play();
  //   counter += 1;
  // }, SHORT_DELAY_MS);

  setTimeout(
    () => {
      console.log('switching to slower');
      clearInterval(interval);
      interval = playSoundsWithDelay(LONG_DELAY_MS, counterRef);
    },
    durationMs - LONG_DELAY_MS - SLOWER_SECTION_DURATION_MS,
  );

  setTimeout(() => {
    clearInterval(interval);
    setTimeout(() => {
      const a = new Audio(rDecide);
      a.play();
    }, FINAL_DELAY_MS);
  }, durationMs - FINAL_DELAY_MS);

  // audio.volume = 0.25;
  // audio.play();
}
