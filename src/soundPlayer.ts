import r1 from './assets/SE_SYS_CourseSelectRoulette1.wav';
import r2 from './assets/SE_SYS_CourseSelectRoulette2.wav';
import r3 from './assets/SE_SYS_CourseSelectRoulette3.wav';
import r4 from './assets/SE_SYS_CourseSelectRoulette4.wav';
import r5 from './assets/SE_SYS_CourseSelectRoulette5.wav';
import r6 from './assets/SE_SYS_CourseSelectRoulette6.wav';
import r7 from './assets/SE_SYS_CourseSelectRoulette7.wav';
import r8 from './assets/SE_SYS_CourseSelectRoulette8.wav';
import rDecide from './assets/SE_SYS_CourseSelectRouletteDecide.wav';

type PlayerWithStop = {
  stop: () => void;
};

// One full cycle of the 8 notes is ~0.946 seconds
// So the delay between each is 0.946 / 8 = 0.11825 seconds
const SHORT_DELAY_MS = 92;
const LONG_DELAY_MS = 356;

const FINAL_DELAY_MS = 1000;
const SLOWER_SECTION_DURATION_MS = 2600;

const rouletteSoundUrls = [r1, r2, r3, r4, r5, r6, r7, r8];

// I should probably do this after the page loads, but "I'm lazy", according to github copilot
const audioContext = new AudioContext();
let rouletteSoundsBuffers: AudioBuffer[] | null = null;
let rouletteEndSoundBuffer: AudioBuffer | null = null;

(async () => {
  rouletteSoundsBuffers = await Promise.all(
    rouletteSoundUrls.map(async (url) => getAudioBuffer(audioContext, url)),
  );
  rouletteEndSoundBuffer = await getAudioBuffer(audioContext, rDecide);
  console.log('Sounds loaded');
})();

async function getAudioBuffer(
  audioContext: AudioContext,
  filepath: string,
): Promise<AudioBuffer> {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function scheduleBufferAtTime({
  timeFromNowMs,
  bufferNode,
  audioContext,
}: {
  audioContext: AudioContext;
  bufferNode: AudioBufferSourceNode;
  timeFromNowMs: number;
}): void {
  const scheduledTime = audioContext.currentTime + timeFromNowMs / 1000;
  // console.log(
  //   `Scheduling sound ${timeFromNowMs}ms from now at ${scheduledTime}`,
  // );
  bufferNode.connect(audioContext.destination);
  bufferNode.start(timeFromNowMs === 0 ? undefined : scheduledTime);
}

async function playSoundsWithDelay(
  delayMs: number,
  duration: number,
  offsetMs: number,
  audioContext: AudioContext,
  counterRef: {current: number},
): Promise<PlayerWithStop> {
  const soundsToPlayCount = Math.floor(duration / delayMs);
  const nodesScheduled: Array<AudioBufferSourceNode> = [];

  Array.from({length: soundsToPlayCount}).forEach((_, i) => {
    const timeFromNowMs = offsetMs + i * delayMs;

    if (rouletteSoundsBuffers != null) {
      const bufferNode = new AudioBufferSourceNode(audioContext, {
        buffer:
          rouletteSoundsBuffers[
            counterRef.current % rouletteSoundsBuffers.length
          ],
      });
      nodesScheduled.push(bufferNode);
      scheduleBufferAtTime({audioContext, bufferNode, timeFromNowMs});
      counterRef.current += 1;
    } else {
      console.error('rouletteSoundsBuffers is null');
    }
  });

  return {stop: () => nodesScheduled.forEach((node) => node.stop())};
}

export async function playRouletteSound(
  durationSeconds: number,
): Promise<PlayerWithStop> {
  if (audioContext.state === 'suspended') {
    console.log('Resuming audio context.');
    await audioContext.resume();
  }

  const durationMs = durationSeconds * 1000;

  const counterRef = {current: 0};

  const fastSoundsDuration =
    durationMs - SLOWER_SECTION_DURATION_MS - FINAL_DELAY_MS;

  const {stop: stopFast} = await playSoundsWithDelay(
    SHORT_DELAY_MS,
    fastSoundsDuration,
    0,
    audioContext,
    counterRef,
  );

  const {stop: stopSlower} = await playSoundsWithDelay(
    LONG_DELAY_MS,
    SLOWER_SECTION_DURATION_MS,
    fastSoundsDuration,
    audioContext,
    counterRef,
  );

  const rouletteEndSoundBufferNode = new AudioBufferSourceNode(audioContext, {
    buffer: rouletteEndSoundBuffer,
  });

  // The final sound should be played right *on* the durationSeconds provided, not before

  scheduleBufferAtTime({
    audioContext,
    bufferNode: rouletteEndSoundBufferNode,
    timeFromNowMs: durationMs,
  });

  return {
    stop: () => {
      stopFast();
      stopSlower();
      rouletteEndSoundBufferNode.stop();
    },
  };
}
