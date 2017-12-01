import { Transform } from './transform.js';

/**
 * Calculate the transform for a Cornerstone enabled element
 *
 * @param {EnabledElement} enabledElement The Cornerstone Enabled Element
 * @param {Number} [scale] The viewport scale
 * @return {Transform} The current transform
 */
export default function (enabledElement, scale = 1) {

  const transform = new Transform();

  transform.translate(-enabledElement.canvas.width / 2, -enabledElement.canvas.height / 2);

  // Apply the rotation before scaling for non square pixels
  const angle = enabledElement.viewport.rotation;

  if (angle !== 0) {
    transform.rotate(angle * Math.PI / 180);
  }

  // Apply the scale
  let widthScale = enabledElement.viewport.scale;
  let heightScale = enabledElement.viewport.scale;

  if (enabledElement.image.rowPixelSpacing < enabledElement.image.columnPixelSpacing) {
    widthScale *= (enabledElement.image.columnPixelSpacing / enabledElement.image.rowPixelSpacing);
  } else if (enabledElement.image.columnPixelSpacing < enabledElement.image.rowPixelSpacing) {
    heightScale *= (enabledElement.image.rowPixelSpacing / enabledElement.image.columnPixelSpacing);
  }
  transform.scale(widthScale, heightScale);

  // Unrotate to so we can translate unrotated
  if (angle !== 0) {
    transform.rotate(-angle * Math.PI / 180);
  }

  // Apply the pan offset
  transform.translate(enabledElement.viewport.translation.x, enabledElement.viewport.translation.y);

  // Rotate again so we can apply general scale
  if (angle !== 0) {
    transform.rotate(angle * Math.PI / 180);
  }

  const xScale = (enabledElement.viewport.hflip ? -1 : 1) * scale;
  const yScale = (enabledElement.viewport.vflip ? -1 : 1) * scale;

  transform.scale(xScale, yScale);

  return transform;
}
