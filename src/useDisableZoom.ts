import {useLayoutEffect} from 'react';

export default function useDisableZoom(disableZoom: boolean): void {
  // Adjust the meta viewport tag to reflect disabling/enabling zoom
  useLayoutEffect(() => {
    const nodes = document.querySelectorAll('meta[name="viewport"]');
    if (nodes.length === 0) {
      console.error("No meta viewport tag found. Can't disable zoom.");
      return;
    } else if (nodes.length > 1) {
      console.error(
        'Duplicate meta viewport tags found. Removing all but the first one.',
      );
      nodes.forEach((node, index) => {
        if (index > 0) {
          node.remove();
        }
      });
    }

    const mainNode = nodes[0];

    if (disableZoom) {
      mainNode?.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      );
    } else {
      mainNode?.setAttribute('content', 'width=device-width, initial-scale=1');
    }
  }, [disableZoom]);
}
