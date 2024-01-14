export default function debugEvents(
  obj: Element,
  eventNames: string[],
  title: string,
) {
  eventNames.forEach((eventName) => {
    obj.addEventListener(eventName, (e) => {
      console.debug(`[${title}] ${eventName}`, e);
    });
  });
}
