import r1 from './assets/SE_SYS_CourseSelectRoulette1.wav';
import r2 from './assets/SE_SYS_CourseSelectRoulette2.wav';
import r3 from './assets/SE_SYS_CourseSelectRoulette3.wav';
import r4 from './assets/SE_SYS_CourseSelectRoulette4.wav';
import r5 from './assets/SE_SYS_CourseSelectRoulette5.wav';
import r6 from './assets/SE_SYS_CourseSelectRoulette6.wav';
import r7 from './assets/SE_SYS_CourseSelectRoulette7.wav';
import r8 from './assets/SE_SYS_CourseSelectRoulette8.wav';
import rDecide from './assets/SE_SYS_CourseSelectRouletteDecide.wav';
import {
  bulkAddEventListeners,
  bulkRemoveEventListeners,
} from './bulkAddEventListeners';
import {
  loadSilentHTMLAudio,
  playSilentHTMLAudioAsync,
} from './playSilentHTMLAudio';

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
console.log('Audio context created. State:', audioContext.state);
audioContext.addEventListener('statechange', (e) => {
  console.log('Audio context state changed', audioContext.state, e);
});

// Load the silent audio to minimize the delay to start playing the silent audio when the user triggers a web audio sound
loadSilentHTMLAudio();

let rouletteSoundsBuffers: AudioBuffer[] | null = null;
let rouletteEndSoundBuffer: AudioBuffer | null = null;

// Load the sounds now so they're ready to play when the user triggers a web audio sound
(async () => {
  rouletteSoundsBuffers = await Promise.all(
    rouletteSoundUrls.map(async (url) => getAudioBuffer(audioContext, url)),
  );
  rouletteEndSoundBuffer = await getAudioBuffer(audioContext, rDecide);
  console.log('Sounds loaded');
})();

const VALID_MEDIA_PLAYBACK_EVENTS = [
  'click',
  // 'contextmenu',
  // 'auxclick',
  // 'dblclick',
  'mousedown',
  'mouseup',
  'touchend',
  'touchstart',
  'keydown',
  'keyup',
];

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

function playSoundsWithDelay(
  delayMs: number,
  duration: number,
  offsetMs: number,
  audioContext: AudioContext,
  counterRef: {current: number},
): PlayerWithStop {
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

function playRouletteSoundBase(durationSeconds: number) {
  const durationMs = durationSeconds * 1000;

  const counterRef = {current: 0};

  const fastSoundsDuration =
    durationMs - SLOWER_SECTION_DURATION_MS - FINAL_DELAY_MS;

  const {stop: stopFast} = playSoundsWithDelay(
    SHORT_DELAY_MS,
    fastSoundsDuration,
    0,
    audioContext,
    counterRef,
  );

  const {stop: stopSlower} = playSoundsWithDelay(
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

export async function resumeAudioContext(): Promise<void> {
  switch (audioContext.state) {
    case 'running':
      console.log('Audio context already running.', audioContext.state);
      return;
    case 'suspended':
      console.log('Resuming audio context.');
      await audioContext.resume();
      console.log('Audio context resumed.', audioContext.state);
      return;
    case 'closed':
    default:
      console.error(
        'Audio context in an unexpected state:',
        audioContext.state,
      );
      return;
  }
}

export async function playRouletteSoundAsync(
  durationSeconds: number,
): Promise<PlayerWithStop> {
  await resumeAudioContext();
  await playSilentHTMLAudioAsync();

  return playRouletteSoundBase(durationSeconds);
}

// NOTE: This has an issue where the first part of the sound gets cut off since we're not awaiting the audio context to resume
export function playRouletteSoundSync(durationSeconds: number): PlayerWithStop {
  if (audioContext.state === 'suspended') {
    console.log('Resuming audio context, but not awaiting.');
    audioContext.resume();
  }

  return playRouletteSoundBase(durationSeconds);
}

async function prepareForSoundsToBePlayed(): Promise<void> {
  console.debug(
    'Valid media playback event triggered. Preparing for sounds to be played...',
  );
  // Not sure if we need to wait on the audio context resuming to play the HTML audio. I *think* we don't?

  await Promise.all([resumeAudioContext(), playSilentHTMLAudioAsync()]);

  // We can remove all the event listeners now that the page is ready to play sounds
  bulkRemoveEventListeners(
    window,
    VALID_MEDIA_PLAYBACK_EVENTS,
    prepareForSoundsToBePlayed,
  );
}

function addMediaPlaybackEventListenersToWindow(): void {
  bulkAddEventListeners(
    window,
    VALID_MEDIA_PLAYBACK_EVENTS,
    prepareForSoundsToBePlayed,
  );
}

addMediaPlaybackEventListenersToWindow();
