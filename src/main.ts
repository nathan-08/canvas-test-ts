import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Rect, Direction, Player, TileMap, Point, IOController } from './lib';

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
  //document.body.appendChild( altCanvas );

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

  const p = new Player( 16*4, 16*4 - 4, new Point( 3, 7 ) );
  const ioController = new IOController();
  let frame = 0;
  const counter = 0;
  let animationCounter = 0;

  function checkTile(
    moveTo: Point,
    mapDimensions: Point,
    obs: Point[],
  ): boolean {
    if (
      moveTo.x < 0 ||
      moveTo.y < 0 ||
      moveTo.x === mapDimensions.x ||
      moveTo.y === mapDimensions.y
    ) {
      return false;
    }
    for( let i = 0; i < obs.length; i++ ) {
      if( moveTo.x === obs[i].x && moveTo.y === obs[i].y ) {
        return false;
      }
    }
    return true;
  }

  let frameIndex = 0;
  function gameLoop() {
    const keys = ioController.getKeys();
    if ( animationCounter === 0 ) {
      p.isMoving = false;
      // ready for new directional input, ready to initiate new animation
      if ( keys.up || keys.down || keys.left || keys.right ) {
        animationCounter = 16;
        if ( keys.up ) {
          p.dir = Direction.up;
          /** check for available tile */ const canMove = checkTile(
            new Point( p.tilePos.x, p.tilePos.y - 1 ),
            roomMap.getTileDimensions(),
            roomMap.getObs(),
          );
          if ( canMove ) {
            p.tilePos.y--;
            p.isMoving = true;
          }
        }
        if ( keys.down ) {
          p.dir = Direction.down;
          const canMove = checkTile(
            new Point( p.tilePos.x, p.tilePos.y + 1 ),
            roomMap.getTileDimensions(),
            roomMap.getObs(),
          );
          if ( canMove ) {
            p.tilePos.y++;
            p.isMoving = true;
          }
        }
        if ( keys.left ) {
          p.dir = Direction.left;
          const canMove = checkTile(
            new Point( p.tilePos.x - 1, p.tilePos.y ),
            roomMap.getTileDimensions(),
            roomMap.getObs(),
          );
          if ( canMove ) {
            p.tilePos.x--;
            p.isMoving = true;
          }
        }
        if ( keys.right ) {
          p.dir = Direction.right;
          const canMove = checkTile(
            new Point( p.tilePos.x + 1, p.tilePos.y ),
            roomMap.getTileDimensions(),
            roomMap.getObs(),
          );
          if ( canMove ) {
            p.tilePos.x++;
            p.isMoving = true;
          }
        }
      } else {
        p.isMoving = false;
      }
      frameIndex = p.dir;
    } else {
      switch ( p.dir ) {
        case Direction.up:
          if( p.isMoving ) /*p.y--;*/ roomMap.offsety++;
          frameIndex = animationCounter > 7 ? p.dir : p.step ? 5 : 3;
          break;
        case Direction.down:
          if( p.isMoving ) /*p.y++;*/ roomMap.offsety--;
          frameIndex = animationCounter > 7 ? p.dir : p.step ? 0 : 2;
          break;
        case Direction.left:
          if( p.isMoving ) /*p.x--;*/ roomMap.offsetx++;
          frameIndex = animationCounter > 7 ? p.dir : 7;
          break;
        case Direction.right:
          if( p.isMoving ) /*p.x++;*/ roomMap.offsetx--;
          frameIndex = animationCounter > 7 ? p.dir : 9;
          break;
      }
      animationCounter--;
      if( animationCounter === 0 && ( p.dir === Direction.up || p.dir === Direction.down ) ) {
        p.step = !p.step;
      }
    }

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    roomMap.render( ctx );

    ctx.drawImage( walkingImgs[frameIndex], p.x, p.y );
    frame++;
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

class ImageAsset {
  public readonly img;
  constructor( path: string ) {
    this.img = new Image();
    this.img.src = path;
  }
  public async wait(): Promise<void> {
    if ( this.img.complete ) {
      return Promise.resolve();
    } else
      return new Promise( ( resolve ) => {
        this.img.addEventListener( 'load', () => resolve() );
      } );
  }
}
