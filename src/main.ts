import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  Rect,
  Direction,
  Player,
  TileMap2,
  Point,
  IOController,
  AnimationController,
  ImageAsset,
  getPlayerImgs,
} from './lib';
import { getFadeInAnimation, getFadeOutAnimation } from './actions';

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

  // const altCanvas = document.createElement( 'canvas' );
  // altCanvas.width = 256;
  // altCanvas.height = 128;
  // altCanvas.setAttribute(
  //   'style',
  //   'image-rendering: pixelated; height: 512px; width: 1024px; background: black',
  // );
  // const altCtx = altCanvas.getContext( '2d' );
  // document.body.appendChild( altCanvas );

  // Load images //
  const spriteImg = new ImageAsset( '../assets/pokemon.png' );
  const tileset = new ImageAsset( '../assets/tileset.png' );
  await Promise.all( [
    spriteImg.wait(),
    tileset.wait(),
  ] );
  
  const tileMap = new TileMap2( tileset.img );
  function gameLoop2() {
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    tileMap.render( ctx );
    requestAnimationFrame( gameLoop2 );
  }
  gameLoop2();

  // set up gameloop stuff
  const p = new Player( 16 * 4, 16 * 4 - 4, new Point( 0, 0 ) );
  //const walkingImgs = await getPlayerImgs( spriteImg.img, altCtx );
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
        //
      } else if ( keys.s ) {
        //
      } else if ( keys.up ) {
        // p.dir = Direction.up;
        // const { walkable, tileAction } = mc.checkTile2( p.tilePos.x, p.tilePos.y - 1 );
        // if ( walkable ) {
        //   p.tilePos.y--;
        //   p.isMoving = true;
        // }
        // ac.startAnimation( {
        //   action: () => {
        //     if ( p.isMoving ) mc.offsety++;
        //     frameIndex = p.dir;
        //   },
        //   frames: 8,
        //   onComplete: () => {
        //     if ( p.isMoving || ioController.getKeys().up ) {
        //       ac.startAnimation( {
        //         action: () => {
        //           if ( p.isMoving ) mc.offsety++;
        //           frameIndex = p.step ? 5 : 3;
        //         },
        //         frames: 8,
        //         onComplete: () => {
        //           p.step = !p.step;
        //           if ( tileAction ) ac.startAnimation( tileAction );
        //         },
        //       } );
        //     }
        //   },
        // } );
      } else if ( keys.down ) {
        // p.dir = Direction.down;
        // const { walkable, tileAction } = mc.checkTile2( p.tilePos.x, p.tilePos.y + 1 );
        // if ( walkable ) {
        //   p.tilePos.y++;
        //   p.isMoving = true;
        // }
        // ac.startAnimation( {
        //   action: () => {
        //     if ( p.isMoving ) mc.offsety--;
        //     frameIndex = p.dir;
        //   },
        //   frames: 8,
        //   onComplete: () => {
        //     if ( p.isMoving || ioController.getKeys().down ) {
        //       ac.startAnimation( {
        //         action: () => {
        //           if ( p.isMoving ) mc.offsety--;
        //           frameIndex = p.step ? 0 : 2;
        //         },
        //         frames: 8,
        //         onComplete: () => {
        //           p.step = !p.step;
        //           if ( tileAction ) ac.startAnimation( tileAction );
        //         }
        //       } );
        //     }
        //   },
        // } );
      } else if ( keys.left ) {
        // p.dir = Direction.left;
        // if ( mc.checkTile( p.tilePos.x - 1, p.tilePos.y ) ) {
        //   p.tilePos.x--;
        //   p.isMoving = true;
        // }
        // ac.startAnimation( {
        //   action: () => {
        //     if ( p.isMoving ) mc.offsetx++;
        //     frameIndex = p.dir;
        //   },
        //   frames: 8,
        //   onComplete: () => {
        //     if ( p.isMoving || ioController.getKeys().left ) {
        //       ac.startAnimation( {
        //         action: () => {
        //           if ( p.isMoving ) mc.offsetx++;
        //           frameIndex = 7;
        //         },
        //         frames: 8,
        //       } );
        //     }
        //   },
        // } );
      } else if ( keys.right ) {
        // p.dir = Direction.right;
        // if ( mc.checkTile( p.tilePos.x + 1, p.tilePos.y ) ) {
        //   p.tilePos.x++;
        //   p.isMoving = true;
        // }
        // ac.startAnimation( {
        //   action: () => {
        //     if ( p.isMoving ) mc.offsetx--;
        //     frameIndex = p.dir;
        //   },
        //   frames: 8,
        //   onComplete: () => {
        //     if ( p.isMoving || ioController.getKeys().right ) {
        //       ac.startAnimation( {
        //         action: () => {
        //           if ( p.isMoving ) mc.offsetx--;
        //           frameIndex = 9;
        //         },
        //         frames: 8,
        //       } );
        //     }
        //   },
        // } );
      }
      frameIndex = p.dir;
    }
    ac.step();

    //ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    //mc.render( ctx );

    //ctx.drawImage( walkingImgs[frameIndex], p.x, p.y ); // p.render();

    delta = performance.now() - timestamp;
    if ( delta > 1 ) console.warn( `--> gameLoop took ${delta}ms` );
    requestAnimationFrame( gameLoop );
  }

  //gameLoop();
}
