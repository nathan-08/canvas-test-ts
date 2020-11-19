import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  Rect,
  Direction,
  Player,
  RoomMap, OutdoorMap, MapController,
  Point,
  IOController,
  AnimationController,
  ImageAsset,
  imgDataToImage,
  drawSprite,
  getPlayerImgs,
} from './lib';
import { getFadeInAnimation, getFadeOutAnimation } from './actions';
import { IAnimation } from './types';

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
    'image-rendering: pixelated; height: 512px; width: 1024px; background: black',
  );
  const altCtx = altCanvas.getContext( '2d' );
  //document.body.appendChild( altCanvas );

  // Load images //
  const fontImg = new ImageAsset( './assets/nesfont.bmp' );
  const mapImg = new ImageAsset( './assets/map1.png' );
  const spriteImg = new ImageAsset( '../assets/pokemon.png' );
  const tileset = new ImageAsset( '../assets/tileset.png' );
  await Promise.all( [
    fontImg.wait(),
    mapImg.wait(),
    spriteImg.wait(),
    tileset.wait(),
  ] );

  let promises = [];
  const walkingImgs = await getPlayerImgs( spriteImg.img, altCtx );

  // get map tiles
  drawSprite(
    altCtx,
    mapImg.img,
    new Rect( 2 + 16 * 2, 2 + 16 * 4, 16, 16 ),
    0,
    16 * 4,
  );
  const idata = altCtx.getImageData( 0, 16 * 4, 16, 16 );
  const grassTile = await imgDataToImage( idata );
  promises = [];
  const waterRect = new Rect( 16 * 14.5 - 1, 16 * 3 - 1, 16 * 3, 16 * 4 );
  for ( let i = 0; i < 4; i++ ) {
    for ( let j = 0; j < 5; j++ ) {
      drawSprite(
        altCtx,
        tileset.img,
        new Rect( waterRect.x + 10 * i, waterRect.y + 10 * j, 8, 8 ),
        8 * i,
        8 * j + 16,
      );
      const s = altCtx.getImageData( 8 * i, 8 * j + 16, 8, 8 );
      promises.push( imgDataToImage( s ) );
    }
  }
  const sceneryImgs = await Promise.all( promises );

  // get shoreline textures
  promises = [];
  const miscSpritesRect = new Rect( 16 * 21 + 4, 16 * 11, 16 * 3, 16 * 3 );
  drawSprite( altCtx, tileset.img, miscSpritesRect, 0, 16 * 5 );
  for ( let i = 0; i < 2; i++ ) {
    for ( let j = 0; j < 4; j++ ) {
      const s = altCtx.getImageData( 16 + j * 8, 16 * 7 + i * 8, 8, 8 );
      promises.push( imgDataToImage( s ) );
    }
  }
  const shorelineImgs = await Promise.all( promises );
  for ( let i = 0; i < shorelineImgs.length; i++ ) {
    drawSprite(
      altCtx,
      shorelineImgs[i],
      new Rect( 0, 0, 8, 8 ),
      16 * 3 + 8 * i,
      16 * 5,
    );
  }

  const outdoorMap = new OutdoorMap(
    mapImg.img,
    sceneryImgs,
    shorelineImgs,
    {
      ...getFadeOutAnimation( ctx ),
      onComplete: () => {
        mc.setMapIndex( 1 );
        p.tilePos.x = 3; p.tilePos.y = 7;
        mc.offsetx = 16;
        mc.offsety = -16*3;
        ac.startAnimation( getFadeInAnimation( ctx ) );
      }
    }
  );
  await outdoorMap.init();
  const roomMap = new RoomMap( mapImg.img, {
    ...getFadeOutAnimation( ctx ),
    onComplete: () => {
      mc.setMapIndex( 0 );
      p.tilePos.x = 5; p.tilePos.y = 3;
      mc.offsetx = -16;
      mc.offsety = 16;
      ac.startAnimation( getFadeInAnimation( ctx ) );
    }
  } );
  await roomMap.init();
  const mc = new MapController( [ outdoorMap, roomMap ] );
  mc.setMapIndex( 0 );

  const p = new Player( 16 * 4, 16 * 4 - 4, new Point( 0, 0 ) );
  const ioController = new IOController();
  const ac = new AnimationController();
  let frameIndex = 0;
  let timestamp = 0,
    delta = 0;

  function gameLoop() {
    timestamp = performance.now();
    if ( ac.ready ) {
      p.isMoving = false;
      const keys = ioController.getKeys();
      if ( keys.a ) {
        ac.startAnimation(
          { ...getFadeOutAnimation( ctx ), onComplete: () => {
            mc.setMapIndex( mc.mapIndex === 0 ? 1 : 0 );
            if( mc.mapIndex === 1 ) { // going into room
              p.tilePos.x = 3; p.tilePos.y = 7;
              mc.offsetx = 16;
              mc.offsety = -16*3;
            } else {
              p.tilePos.x = 5; p.tilePos.y = 3;
              mc.offsetx =  -16;
              mc.offsety =  16;
            }
          }}
        );
      } else if ( keys.s ) {
        ac.startAnimation( getFadeInAnimation( ctx ) );
      } else if ( keys.up ) {
        p.dir = Direction.up;
        const { walkable, tileAction } = mc.checkTile2( p.tilePos.x, p.tilePos.y - 1 );
        if ( walkable ) {
          p.tilePos.y--;
          p.isMoving = true;
        }
        ac.startAnimation( {
          action: () => {
            if ( p.isMoving ) mc.offsety++;
            frameIndex = p.dir;
          },
          frames: 8,
          onComplete: () => {
            if ( p.isMoving || ioController.getKeys().up ) {
              ac.startAnimation( {
                action: () => {
                  if ( p.isMoving ) mc.offsety++;
                  frameIndex = p.step ? 5 : 3;
                },
                frames: 8,
                onComplete: () => {
                  p.step = !p.step;
                  if ( tileAction ) ac.startAnimation( tileAction );
                },
              } );
            }
          },
        } );
      } else if ( keys.down ) {
        p.dir = Direction.down;
        const { walkable, tileAction } = mc.checkTile2( p.tilePos.x, p.tilePos.y + 1 );
        if ( walkable ) {
          p.tilePos.y++;
          p.isMoving = true;
        }
        ac.startAnimation( {
          action: () => {
            if ( p.isMoving ) mc.offsety--;
            frameIndex = p.dir;
          },
          frames: 8,
          onComplete: () => {
            if ( p.isMoving || ioController.getKeys().down ) {
              ac.startAnimation( {
                action: () => {
                  if ( p.isMoving ) mc.offsety--;
                  frameIndex = p.step ? 0 : 2;
                },
                frames: 8,
                onComplete: () => {
                  p.step = !p.step;
                  if ( tileAction ) ac.startAnimation( tileAction );
                }
              } );
            }
          },
        } );
      } else if ( keys.left ) {
        p.dir = Direction.left;
        if ( mc.checkTile( p.tilePos.x - 1, p.tilePos.y ) ) {
          p.tilePos.x--;
          p.isMoving = true;
        }
        ac.startAnimation( {
          action: () => {
            if ( p.isMoving ) mc.offsetx++;
            frameIndex = p.dir;
          },
          frames: 8,
          onComplete: () => {
            if ( p.isMoving || ioController.getKeys().left ) {
              ac.startAnimation( {
                action: () => {
                  if ( p.isMoving ) mc.offsetx++;
                  frameIndex = 7;
                },
                frames: 8,
              } );
            }
          },
        } );
      } else if ( keys.right ) {
        p.dir = Direction.right;
        if ( mc.checkTile( p.tilePos.x + 1, p.tilePos.y ) ) {
          p.tilePos.x++;
          p.isMoving = true;
        }
        ac.startAnimation( {
          action: () => {
            if ( p.isMoving ) mc.offsetx--;
            frameIndex = p.dir;
          },
          frames: 8,
          onComplete: () => {
            if ( p.isMoving || ioController.getKeys().right ) {
              ac.startAnimation( {
                action: () => {
                  if ( p.isMoving ) mc.offsetx--;
                  frameIndex = 9;
                },
                frames: 8,
              } );
            }
          },
        } );
      }
      frameIndex = p.dir;
    }
    ac.step();

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    mc.render( ctx );

    ctx.drawImage( walkingImgs[frameIndex], p.x, p.y ); // p.render();

    delta = performance.now() - timestamp;
    if ( delta > 1 ) console.warn( `--> gameLoop took ${delta}ms` );
    requestAnimationFrame( gameLoop );
  }

  gameLoop();
}
