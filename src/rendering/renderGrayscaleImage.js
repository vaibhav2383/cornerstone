import storedPixelDataToCanvasImageData from '../internal/storedPixelDataToCanvasImageData.js';
import storedPixelDataToCanvasImageDataRGBA from '../internal/storedPixelDataToCanvasImageDataRGBA.js';
import now from '../internal/now.js';
import webGL from '../webgl/index.js';
import getLut from './getLut.js';
import saveLastRendered from './saveLastRendered.js';

/**
 * API function to draw a grayscale image to a given enabledElement
 *
 * @param {EnabledElement} enabledElement The Cornerstone Enabled Element to redraw
 * @param {Boolean} invalidated - true if pixel data has been invalidated and cached rendering should not be used
 * @returns {void}
 */
export function renderGrayscaleImage (enabledElement, invalidated) {
  if (enabledElement === undefined) {
    throw new Error('drawImage: enabledElement parameter must not be undefined');
  }

  const image = enabledElement.image;

  if (image === undefined) {
    throw new Error('drawImage: image must be loaded before it can be drawn');
  }

  // Get the canvas context and reset the transform
  const context = enabledElement.canvas.getContext('2d');
  const canvas = enabledElement.canvas;

  context.setTransform(1, 0, 0, 1, 0, 0);

  // Clear the canvas
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Turn off image smooth/interpolation if pixelReplication is set in the viewport
  context.imageSmoothingEnabled = !enabledElement.viewport.pixelReplication;
  context.mozImageSmoothingEnabled = context.imageSmoothingEnabled;

  const useAlphaChannel = true;
  const canvasData = context.getImageData(0, 0, canvas.width, canvas.height);

  // Get the lut to use
  let start = now();
  const lut = getLut(image, enabledElement.viewport, invalidated);

  image.stats = image.stats || {};
  image.stats.lastLutGenerateTime = now() - start;

  // Gray scale image - apply the lut and put the resulting image onto the render canvas
  if (useAlphaChannel) {
    storedPixelDataToCanvasImageData(image, lut, canvasData.data);
  } else {
    storedPixelDataToCanvasImageDataRGBA(image, lut, canvasData.data);
  }

  start = now();
  context.putImageData(canvasData, 0, 0);
  image.stats.lastPutImageDataTime = now() - start;

  enabledElement.renderingTools = saveLastRendered(enabledElement);
}

/**
 * API function to draw a grayscale image to a given layer
 *
 * @param {EnabledElementLayer} layer The layer that the image will be added to
 * @param {Boolean} invalidated - true if pixel data has been invalidated and cached rendering should not be used
 * @param {Boolean} [useAlphaChannel] - Whether or not to render the grayscale image using only the alpha channel.
                                        This does not work if this layer is not the first layer in the enabledElement.
 * @returns {void}
 */
export function addGrayscaleLayer (layer, invalidated, useAlphaChannel = false) {
  if (layer === undefined) {
    throw new Error('addGrayscaleLayer: layer parameter must not be undefined');
  }

  const image = layer.image;

  if (image === undefined) {
    throw new Error('addGrayscaleLayer: image must be loaded before it can be drawn');
  }

  // layer.canvas = getRenderCanvas(layer, image, invalidated, useAlphaChannel);

  const context = layer.canvas.getContext('2d');

  // Turn off image smooth/interpolation if pixelReplication is set in the viewport
  context.imageSmoothingEnabled = !layer.viewport.pixelReplication;
  context.mozImageSmoothingEnabled = context.imageSmoothingEnabled;

  layer.renderingTools = saveLastRendered(layer);
}
