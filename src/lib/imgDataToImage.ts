export async function imgDataToImage (
  imageData: ImageData,
): Promise<HTMLImageElement> {
  const canvas = document.createElement( 'canvas' );
  const ctx = canvas.getContext( '2d' );
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData( imageData, 0, 0 );
  const img = new Image();
  img.src = canvas.toDataURL();
  await new Promise( ( resolve ) => img.addEventListener( 'load', resolve ) );
  return img;
}