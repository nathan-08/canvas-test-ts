import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  Player,
  Point,
  IOController,
  AnimationController,
  ImageAsset,
  OutputController,
} from './lib';
import { IRenderFlags } from './types';
import { getFadeInAction, getFadeOutAction } from './actions';
import { colorscheme } from './colorscheme';
import { version } from '../package.json';
import { MapController, HouseMap, TownMap, HouseMap2 } from './maps';

window.onload = main;

async function main(): Promise<void> {
  const htmlText = document.getElementById( 'title' );
  const setHTMLText = ( msg: string ) => ( htmlText.textContent = msg );
  setHTMLText( `version ${version}` );
  const canvas = document.createElement( 'canvas' );
  canvas.width = 16 * 10;
  canvas.height = 16 * 9;
  canvas.style.imageRendering = 'pixelated';
  canvas.style.width = `${canvas.width * 4}px`;
  canvas.style.height = `${canvas.height * 4}px`;
  canvas.style.background = 'rgb(20,20,20)';
  document.body.appendChild( canvas );
  const ctx = canvas.getContext( '2d' );

  const offscreenCanvas = document.createElement( 'canvas' );
  canvas.width = 16*10;
  canvas.height=16*9;

  const spriteImg = new ImageAsset( '../assets/pokemon.png' );
  const tileset = new ImageAsset( '../assets/tileset.png' );
  const fontTileset = new ImageAsset( '../assets/font_a.png' );
  await Promise.all( [spriteImg.wait(), tileset.wait(), fontTileset.wait()] );

  const p = new Player( new Point( 4, 4 ), spriteImg.img );
  const outputController = new OutputController( fontTileset.img );
  const io = new IOController();
  const ac = new AnimationController();
  const townMap = new TownMap(
    () => [
    getFadeOutAction( ctx, altCtx, renderFlags ), // to right house
    {
      frames: 1,
      action: () => {
        mc.setMapIndex( 1 );
        p.tilePos.x = 4;
        p.tilePos.y = 7;
        mc.x = 0;
        mc.y = -16 * 3;
        return true;
      },
    },
    getFadeInAction( ctx, altCtx, renderFlags ),
  ],
    () => [
    getFadeOutAction( ctx, altCtx, renderFlags ), // to left house
    {
      frames: 1,
      action: () => {
        mc.setMapIndex( 2 );
        p.tilePos.x = 4;
        p.tilePos.y = 7;
        mc.x = 0;
        mc.y = -16 * 3;
        return true;
      },
    },
    getFadeInAction( ctx, altCtx, renderFlags ),
  ],
  outputController,
  p.canvas,
  p,
  ac,
  );
  const houseMap = new HouseMap(
    () => [
    getFadeOutAction( ctx, altCtx, renderFlags ),
    {
      frames: 1,
      action: () => {
        mc.setMapIndex( 0 ); // to outside
        // adjust player and map positions
        p.tilePos.x = 10;
        p.tilePos.y = 5;
        mc.x = -16 * 6;
        mc.y = -16 * 1;
        return true;
      },
    },
    getFadeInAction( ctx, altCtx, renderFlags ),
  ],
  outputController,
  );
  const houseMap2 = new HouseMap2(
    () => [
      getFadeOutAction( ctx, altCtx, renderFlags ),
      {
        frames: 1,
        action: () => {
          mc.setMapIndex( 0 ); // to outside
          p.tilePos.x = 2;
          p.tilePos.y = 5;
          mc.x = 16 * 2;
          mc.y = -16 * 1;
          return true;
        },
      },
      getFadeInAction( ctx, altCtx, renderFlags ),
    ],
    outputController,
  );
  const mc = new MapController( [townMap, houseMap, houseMap2], 1, tileset.img );
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
    ac._step( io.getKeys() );

    if ( !renderFlags.renderOverrideFlag ) {
      const _ctx = offscreenCanvas.getContext( '2d' );
      _ctx.clearRect( 0, 0, _ctx.canvas.width, _ctx.canvas.height );
      mc.render( _ctx );
      p.render( _ctx, mc.legsUnderGrass( p ) );
      _ctx.globalCompositeOperation = 'destination-over';
      _ctx.fillStyle = `rgb(${colorscheme.lightest[0]},${colorscheme.lightest[1]},${colorscheme.lightest[2]})`;
      _ctx.fillRect( mc.x, mc.y, mc.w16 * 16, mc.h16 * 16 );
      _ctx.globalCompositeOperation = 'source-over';
      outputController.testRender( _ctx );

      const onscreen_ctx = renderFlags.altCanvas ? altCtx : ctx;
      onscreen_ctx.clearRect( 0, 0, onscreen_ctx.canvas.width, onscreen_ctx.canvas.height );
      onscreen_ctx.drawImage( offscreenCanvas, 0, 0 );
      
    }

    requestAnimationFrame( gameLoop2 );
  }
  gameLoop2();
}
