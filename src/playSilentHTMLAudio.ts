import {bulkAddEventListeners} from './bulkAddEventListeners';

let channelTag: HTMLAudioElement;

// Didn't work:
// const silentWavDataURI =
//   'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAAZGF0YQAAAAA=';

// Didn't work:
// const silentWavDataURI =
//   'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

// From: https://stackoverflow.com/a/12150808
// Didn't work
// const silentWavDataURI =
//   'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==';

/**
 * A utility function for decompressing the base64 silence string. A poor-mans implementation of huffman decoding.
 * @param count The number of times the string is repeated in the string segment.
 * @param repeatStr The string to repeat.
 * @returns The
 */
function huffman(count: number, repeatStr: string) {
  var e = repeatStr;
  for (; count > 1; count--) e += repeatStr;
  return e;
}
/**
 * A very short bit of silence to be played with <audio>, which forces AudioContext onto the ringer channel.
 * NOTE: The silence MP3 must be high quality, when web audio sounds are played in parallel the web audio sound is mixed to match the bitrate of the html sound.
 * This file is 0.01 seconds of silence VBR220-260 Joint Stereo 859B
 * The str below is a "compressed" version using poor mans huffman encoding, saves about 0.5kb
 */
const silence =
  'data:audio/mpeg;base64,//uQx' +
  huffman(23, 'A') +
  'WGluZwAAAA8AAAACAAACcQCA' +
  huffman(16, 'gICA') +
  huffman(66, '/') +
  '8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAAnGMHkkI' +
  huffman(320, 'A') +
  '//sQxAADgnABGiAAQBCqgCRMAAgEAH' +
  huffman(15, '/') +
  '7+n/9FTuQsQH//////2NG0jWUGlio5gLQTOtIoeR2WX////X4s9Atb/JRVCbBUpeRUq' +
  huffman(18, '/') +
  '9RUi0f2jn/+xDECgPCjAEQAABN4AAANIAAAAQVTEFNRTMuMTAw' +
  huffman(97, 'V') +
  'Q==';

// function createChannelTagHTML() {
//   var tmp = document.createElement('div');
//   tmp.innerHTML = "<audio x-webkit-airplay='deny'></audio>"; // Airplay like controls on other devices, prevents casting of the tag, doesn't work on modern iOS
//   channelTag = nullthrows(tmp.children.item(0)) as HTMLAudioElement;
//   channelTag.controls = false;
//   channelTag.disableRemotePlayback = true; // Airplay like controls on other devices, prevents casting of the tag, doesn't work on modern iOS
//   channelTag.preload = 'auto';
//   channelTag.src = silence;
//   channelTag.loop = true;
//   channelTag.load();
//   console.log('Created channel tag', channelTag, channelTag.duration);
// }

export function loadSilentHTMLAudio() {
  console.debug('Creating channel tag via js');
  channelTag = new Audio(silence);
  bulkAddEventListeners(
    channelTag,
    [
      'play',
      // 'playing',
      'pause',
      'ended',
      'durationchange',
      'error',
      'loadeddata',
      'loadstart',
    ],
    (e) => {
      console.debug(`[silentHTMLAudio] ${e.type}`, e);
    },
  );

  // var tmp = document.createElement('div');
  // tmp.innerHTML = "<audio x-webkit-airplay='deny'></audio>"; // Airplay like controls on other devices, prevents casting of the tag, doesn't work on modern iOS
  // channelTag = nullthrows(tmp.children.item(0)) as HTMLAudioElement;
  channelTag.controls = false;
  channelTag.disableRemotePlayback = true; // Airplay like controls on other devices, prevents casting of the tag, doesn't work on modern iOS
  channelTag.preload = 'auto';
  // channelTag.src = silence;
  channelTag.loop = true;
  channelTag.load();
  console.log('Created channel tag', channelTag, channelTag.duration);
}

// Play a silent HTML audio element to force the Web Audio API sounds to play on the media channel rather than the ringer channel
export function playSilentHTMLAudio() {
  // Create a new channel tag if necessary
  if (!channelTag) {
    loadSilentHTMLAudio();
  }
  // Play the channel tag
  if (channelTag.paused) {
    channelTag.play().then(
      () => {
        console.debug('playSilentHTMLAudio: play success');
      },
      (e) => {
        console.error('playSilentHTMLAudio: play error', e);
      },
    );
  }
}

export async function playSilentHTMLAudioAsync(): Promise<void> {
  // Create a new channel tag if necessary
  if (!channelTag) {
    loadSilentHTMLAudio();
  }
  if (!channelTag.paused) {
    console.debug('playSilentHTMLAudio: already playing');
    return;
  }
  // Play the channel tag
  return channelTag.play().then(
    () => {
      console.debug('playSilentHTMLAudio: playback successfully started');
    },
    (e) => {
      console.error('playSilentHTMLAudio: playback error', e);
    },
  );
}
