import { getEnabledElement } from './enabledElements.js';
import fitToWindow from './fitToWindow.js';
import updateImage from './updateImage.js';
import triggerEvent from './triggerEvent.js';

/**
 * Resizes an enabled element and optionally fits the image to window
 *
 * @param {HTMLElement} element The DOM element enabled for Cornerstone
 * @param {Boolean} fitViewportToWindow true to refit, false to leave viewport parameters as they are
 * @returns {void}
 */
export default function (element, fitViewportToWindow) {

  const enabledElement = getEnabledElement(element);
  const { image, canvas } = enabledElement;

  if (!image) {
    return;
  }

  // Avoid setting the same value because it flashes the canvas with IE and Edge
  if (canvas.width !== image.columns) {
    canvas.width = image.columns;
    canvas.style.width = `${image.columns}px`;
  }
  // Avoid setting the same value because it flashes the canvas with IE and Edge
  if (canvas.height !== image.rows) {
    canvas.height = image.rows;
    canvas.style.height = `${image.rows}px`;
  }

  const eventData = {
    element
  };

  triggerEvent(element, 'CornerstoneElementResized', eventData);

  if (fitViewportToWindow === true) {
    fitToWindow(element);
  } else {
    updateImage(element);
  }
}
