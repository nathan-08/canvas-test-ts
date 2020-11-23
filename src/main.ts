import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  Player,
  TileMap2,
  Point,
  IOController,
  AnimationController,
  ImageAsset,
  OutputController,
  MapController,
  HouseMap,
} from './lib';
import { IRenderFlags } from './types';
import { getFadeInAction, getFadeOutAction } from './actions';

window.onload = main;

async function main(): Promise<void> {
  const canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;
  canvas.setAttribute(
    'style',
    'border: 0px solid blue; image-rendering: pixelated; height: 512px; width: 512px; background: rgb(20,20,20)',
  );
  document.body.appendChild( canvas );
  const ctx = canvas.getContext( '2d' );

  const spriteImg = new ImageAsset( '../assets/pokemon.png' );
  const tileset = new ImageAsset( '../assets/tileset.png' );
  const fontTileset = new ImageAsset( '../assets/font_a.png' );
  await Promise.all( [spriteImg.wait(), tileset.wait(), fontTileset.wait()] );

  const p = new Player( new Point( 4, 4 ), spriteImg.img );
  const outputController = new OutputController( fontTileset.img );
  const io = new IOController();
  const ac = new AnimationController();
  const tileMap = new TileMap2( () => ( {
    ...getFadeOutAction( ctx, altCtx, renderFlags ),
    onComplete: () => {
      mc.setMapIndex( 1 );
      p.tilePos.x = 4;
      p.tilePos.y = 7;
      mc.x = 0;
      mc.y = -16 * 3;
      ac.startAnimation( {
        ...getFadeInAction( ctx, altCtx, renderFlags ),
        onComplete: () => console.log( 'home sweet home!' ),
      } );
    }
  } ) );
  const houseMap = new HouseMap( () => ( {
    ...getFadeOutAction( ctx, altCtx, renderFlags ),
    onComplete: () => {
      mc.setMapIndex( 0 ); // to outside
      // adjust player and map positions
      p.tilePos.x = 6;
      p.tilePos.y = 1;
      mc.x = -16 * 2;
      mc.y = 16 * 3;
      ac.startAnimation( {
        ...getFadeInAction( ctx, altCtx, renderFlags ),
        onComplete: () => console.log( 'outside!' ),
      } );
    },
  } ) );
  const mc = new MapController( [tileMap, houseMap], 1, tileset.img );
  const renderFlags: IRenderFlags = {
    renderOverrideFlag: false,
    altCanvas: false,
  };
  const altCanvas = document.createElement( 'canvas' );
  altCanvas.height = canvas.height;
  altCanvas.width = canvas.width;
  altCanvas.style.imageRendering = 'pixelated';
  altCanvas.style.background = 'rgb(20,20,20)';
  const altCtx = altCanvas.getContext( '2d' );
  // GAME LOOP //
  function gameLoop2() {
    if ( ac.ready ) {
      io.handleInput( p, mc, ac, outputController, ctx, altCtx, renderFlags );
    }
    ac.step();

    if ( !renderFlags.renderOverrideFlag ) {
      const _ctx = renderFlags.altCanvas ? altCtx : ctx;
      _ctx.clearRect( 0, 0, _ctx.canvas.width, _ctx.canvas.height );
      mc.render( _ctx );
      p.render( _ctx, mc.legsUnderGrass( p ) );
      _ctx.globalCompositeOperation = 'destination-over';
      _ctx.fillStyle = 'rgb( 155, 188, 15 )';
      _ctx.fillRect( mc.x, mc.y, mc.w16 * 16, mc.h16 * 16 );
      _ctx.globalCompositeOperation = 'source-over';
      outputController.testRender( _ctx );
    }

    requestAnimationFrame( gameLoop2 );
  }
  gameLoop2();
}
