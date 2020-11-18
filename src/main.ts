import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  Rect,
  Direction,
  Player,
  TileMap,
  Point,
  IOController,
  AnimationController,
  Animation,
  ImageAsset,
} from './lib';

window.onload = main;

async function main(): Promise<void> {
  const canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;
  canvas.setAttribute(
    'style',
    'border: 0px solid blue; image-rendering: pixelated; height: 512px; width: 512px; background: black',
  );
  document.body.appendChild( canvas );
  const ctx = canvas.getContext( '2d' );

  const altCanvas = document.createElement( 'canvas' );
  altCanvas.width = 256;
  altCanvas.height = 128;
  altCanvas.setAttribute(
    'style',
    'image-rendering: pixelated; height: 256px; width: 512px; background: black',
  );
  const altCtx = altCanvas.getContext( '2d' );
  document.body.appendChild( altCanvas );

  const fontImg = new ImageAsset( './assets/nesfont.bmp' );
  const mapImg = new ImageAsset( './assets/map1.png' );
  const spriteImg = new ImageAsset( '../assets/pokemon.png' );
  await Promise.all( [fontImg.wait(), mapImg.wait(), spriteImg.wait()] );

  const roomMap = new TileMap(
    new Point( 8, 8 ),
    mapImg.img,
    new Rect( 8 * 17, 8 * 37 - 2, 8 * 16, 8 * 16 ),
  );

  function drawSprite(
    ctx: CanvasRenderingContext2D,
    src: HTMLImageElement,
    rect: Rect,
    dx: number,
    dy: number,
  ) {
    ctx.drawImage( src, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w, rect.h );
  }
  // girl 16*8.5 // boy 16*2 + 2
  const walkingSprites: Rect[] = [
    new Rect( 16 * 0 + 9, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 1 + 10, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 2 + 11, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 3 + 12, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 4 + 13, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 5 + 14, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 6 + 15, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 7 + 16, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 8 + 17, 16 * 2 + 2, 16, 16 ),
    new Rect( 16 * 9 + 18, 16 * 2 + 2, 16, 16 ),
  ];
  const promises = [];
  for ( let i = 0; i < 10; i++ ) {
    drawSprite( altCtx, spriteImg.img, walkingSprites[i], 16 * i, 0 );
    const s = altCtx.getImageData( 16 * i, 0, 16, 16 );
    const x = s.data[0];
    for ( let i = 0; i < s.data.length; i += 4 ) {
      if ( s.data[i] === x ) {
        s.data[i + 3] = 0;
      }
    }
    promises.push( imgdata_to_image( s ) );
  }
  const walkingImgs = await Promise.all( promises );

  const p = new Player( 16 * 4, 16 * 4 - 4, new Point( 3, 7 ) );
  const ioController = new IOController();
  let frameIndex = 0;
  const animationController = new AnimationController();
  let timestamp = 0, delta = 0;

  function gameLoop() {
    timestamp = performance.now();
    if ( animationController.ready ) {
      p.isMoving = false;
      const keys = ioController.getKeys();
      if ( keys.a ) {
        animationController.initiate(
          new Animation( ( frames: number ) => {
            if ( frames > 20 ) {
              ctx.filter = 'brightness( 60% )';
            } else if ( frames > 10 ) {
              ctx.filter = 'brightness( 25% )';
            } else {
              ctx.filter = 'brightness( 0% )';
            }
          }, 30 ),
        );
      } else if( keys.s ) {
        animationController.initiate(
          new Animation( ( frames: number ) => {
            if ( frames > 20 ) {
              ctx.filter = 'brightness( 25% )';
            } else if ( frames > 10 ) {
              ctx.filter = 'brightness( 60% )';
            } else {
              ctx.filter = 'brightness( 100% )';
            }
          }, 30 ),
        );
      } else if ( keys.up ) {
        p.dir = Direction.up;
        if ( roomMap.checkTile( p.tilePos.x, p.tilePos.y - 1 ) ) {
          p.tilePos.y--;
          p.isMoving = true;
        }
        animationController.initiate(
          new Animation( ( frames: number ) => {
            if ( p.isMoving ) roomMap.offsety++;
            frameIndex = frames > 7 ? p.dir : p.step ? 5 : 3;
          }, 16, () => p.step = !p.step ),
        );
      } else if ( keys.down ) {
        p.dir = Direction.down;
        if ( roomMap.checkTile( p.tilePos.x, p.tilePos.y + 1 ) ) {
          p.tilePos.y++;
          p.isMoving = true;
        }
        animationController.initiate(
          new Animation( ( frames: number ) => {
            if ( p.isMoving ) roomMap.offsety--;
            frameIndex = frames > 7 ? p.dir : p.step ? 0 : 2;
          }, 16, () => p.step = !p.step ),
        );
      } else if ( keys.left ) {
        p.dir = Direction.left;
        if ( roomMap.checkTile( p.tilePos.x - 1, p.tilePos.y ) ) {
          p.tilePos.x--;
          p.isMoving = true;
        }
        animationController.initiate(
          new Animation( ( frames: number ) => {
            if ( p.isMoving ) roomMap.offsetx++;
            frameIndex = frames > 7 ? p.dir : 7;
          }, 16 ),
        );
      } else if ( keys.right ) {
        p.dir = Direction.right;
        if ( roomMap.checkTile( p.tilePos.x + 1, p.tilePos.y ) ) {
          p.tilePos.x++;
          p.isMoving = true;
        }
        animationController.initiate(
          new Animation( ( frames: number ) => {
            if ( p.isMoving ) roomMap.offsetx--;
            frameIndex = frames > 7 ? p.dir : 9;
          }, 16 ),
        );
      }
      frameIndex = p.dir;
    }
    animationController.step();

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    roomMap.render( ctx );

    ctx.drawImage( walkingImgs[frameIndex], p.x, p.y );

    delta = performance.now() - timestamp;
    if( delta > 1 ) console.warn( `--> gameLoop took ${delta}ms` );
    requestAnimationFrame( gameLoop );
  }

  gameLoop();
}

async function imgdata_to_image(
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
