export default function (enabledElement, image) {
  const lastRenderedImageId = enabledElement.renderingTools.lastRenderedImageId;
  const lastRenderedViewport = enabledElement.renderingTools.lastRenderedViewport;

  return (
    image.imageId !== lastRenderedImageId ||
    !lastRenderedViewport ||
    lastRenderedViewport.windowCenter !== enabledElement.viewport.voi.windowCenter ||
    lastRenderedViewport.windowWidth !== enabledElement.viewport.voi.windowWidth ||
    lastRenderedViewport.invert !== enabledElement.viewport.invert ||
    lastRenderedViewport.modalityLUT !== enabledElement.viewport.modalityLUT ||
    lastRenderedViewport.voiLUT !== enabledElement.viewport.voiLUT ||
    lastRenderedViewport.colormap !== enabledElement.viewport.colormap
  );
}
