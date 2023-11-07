import r1 from './assets/SE_SYS_CourseSelectRoulette1.wav';
import r2 from './assets/SE_SYS_CourseSelectRoulette2.wav';
import r3 from './assets/SE_SYS_CourseSelectRoulette3.wav';
import r4 from './assets/SE_SYS_CourseSelectRoulette4.wav';
import r5 from './assets/SE_SYS_CourseSelectRoulette5.wav';
import r6 from './assets/SE_SYS_CourseSelectRoulette6.wav';
import r7 from './assets/SE_SYS_CourseSelectRoulette7.wav';
import r8 from './assets/SE_SYS_CourseSelectRoulette8.wav';
import rDecide from './assets/SE_SYS_CourseSelectRouletteDecide.wav';

// One full cycle of the 8 notes is ~0.946 seconds
// So the delay between each is 0.946 / 8 = 0.11825 seconds
const SHORT_DELAY_MS = 92;
const LONG_DELAY_MS = 356;

const FINAL_DELAY_MS = 1000;
const SLOWER_SECTION_DURATION_MS = 2600;

const rouletteSoundUrls = [r1, r2, r3, r4, r5, r6, r7, r8];

async function getAudioBuffer(
  audioContext: AudioContext,
  filepath: string,
): Promise<AudioBuffer> {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

async function playSoundsWithDelay(
  delayMs: number,
  duration: number,
  audioContext: AudioContext,
  counterRef: {current: number},
) {
  const rouletteSounds = await Promise.all(
    rouletteSoundUrls.map(async (url) => getAudioBuffer(audioContext, url)),
  );

  // const rouletteSoundsBufferNodes = rouletteSounds.map(
  //   (buffer) => new AudioBufferSourceNode(audioContext, {buffer: buffer}),
  // );

  // rouletteSoundsBufferNodes.forEach((node) =>
  //   node.connect(audioContext.destination),
  // );

  const soundsToPlayCount = Math.floor(duration / delayMs);

  Array.from({length: soundsToPlayCount}).forEach((_, i) => {
    const scheduledTime = audioContext.currentTime + (i * delayMs) / 1000;
    // console.log(`scheduling sound ${i} for time ${scheduledTime}`);
    const bufferNode = new AudioBufferSourceNode(audioContext, {
      buffer: rouletteSounds[counterRef.current % rouletteSounds.length],
    });
    counterRef.current += 1;
    bufferNode.connect(audioContext.destination);
    bufferNode.start(scheduledTime);
  });

  // return interval;
}

export async function playRouletteSound(durationSeconds: number) {
  const audioContext = new AudioContext();
  // const audio = new Audio('/roulette.mp3');

  const durationMs = durationSeconds * 1000;

  const counterRef = {current: 0};

  const quickSoundsDuration = durationMs - SLOWER_SECTION_DURATION_MS;

  await playSoundsWithDelay(
    SHORT_DELAY_MS,
    quickSoundsDuration,
    audioContext,
    counterRef,
  );
  // const interval = setInterval(() => {
  //   const a = new Audio(rouletteSounds[counter % rouletteSounds.length]);
  //   a.play();
  //   counter += 1;
  // }, SHORT_DELAY_MS);

  // setTimeout(
  //   () => {
  //     console.log('switching to slower');
  //     clearInterval(interval);
  //     interval = playSoundsWithDelay(LONG_DELAY_MS, counterRef);
  //   },
  //   durationMs - LONG_DELAY_MS - SLOWER_SECTION_DURATION_MS,
  // );

  // setTimeout(() => {
  //   clearInterval(interval);
  //   setTimeout(() => {
  //     const a = new Audio(rDecide);
  //     a.play();
  //   }, FINAL_DELAY_MS);
  // }, durationMs - FINAL_DELAY_MS);

  // audio.volume = 0.25;
  // audio.play();
}
