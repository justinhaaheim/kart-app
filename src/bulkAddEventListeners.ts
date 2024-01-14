export function bulkAddEventListeners(
  target: EventTarget,
  events: string[],
  handler: EventListener,
  options?: {capture?: boolean; passive?: boolean},
) {
  events.forEach((e) => target.addEventListener(e, handler, options));
}

export function bulkRemoveEventListeners(
  target: EventTarget,
  events: string[],
  handler: EventListener,
  options?: {capture?: boolean; passive?: boolean},
) {
  events.forEach((e) => target.removeEventListener(e, handler, options));
}
