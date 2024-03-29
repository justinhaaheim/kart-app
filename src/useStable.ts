import {useRef} from 'react';

type UninitializedMarker = Readonly<Record<string, unknown>> | symbol;
const UNINITIALIZED: UninitializedMarker =
  typeof Symbol === 'function' && typeof Symbol() === 'symbol'
    ? Symbol()
    : Object.freeze({});

export default function useStable<T>(initialValueCallback: () => T): T {
  const ref = useRef<T | UninitializedMarker>(UNINITIALIZED);
  if (ref.current === UNINITIALIZED) {
    ref.current = initialValueCallback();
  }
  // @ts-ignore TODO: Look into fixing this ts complaint. This didn't work in flow FWIW
  return ref.current;
}
