import { Rect, imgDataToImage, drawSprite } from '.';

// girl 16*8.5 // boy 16*2 + 2
const walkingSprites: Rect[] = [
  new Rect( 16 * 0 + 9,  16 * 2+2, 16, 16 ),
  new Rect( 16 * 1 + 10, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 2 + 11, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 3 + 12, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 4 + 13, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 5 + 14, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 6 + 15, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 7 + 16, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 8 + 17, 16 * 2+2, 16, 16 ),
  new Rect( 16 * 9 + 18, 16 * 2+2, 16, 16 ),
];

export async function getPlayerImgs(
  src: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
): Promise<HTMLImageElement[]> {
  const promises = [];
  for ( let i = 0; i < 10; i++ ) {
    drawSprite( ctx, src, walkingSprites[i], 16 * i, 0 );
    const imgData = ctx.getImageData( 16 * i, 0, 16, 16 );
    const keyPixel = imgData.data[0];
    for ( let i = 0; i < imgData.data.length; i += 4 ) {
      if ( imgData.data[i] === keyPixel ) {
        imgData.data[i + 3] = 0; // set alpha to 0
      }
    }
    promises.push( imgDataToImage( imgData ) );
  }

  return Promise.all( promises );
}
