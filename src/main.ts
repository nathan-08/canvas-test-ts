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
} from './lib';
import { IRenderFlags } from './types';

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
  const tileMap = new TileMap2( tileset.img );
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
      io.handleInput( p, tileMap, ac, outputController, ctx, altCtx, renderFlags );
    }
    ac.step();

    if ( !renderFlags.renderOverrideFlag ) {
      const _ctx = renderFlags.altCanvas ? altCtx : ctx;
      _ctx.clearRect( 0, 0, _ctx.canvas.width, _ctx.canvas.height );
      tileMap.render( _ctx );
      p.render( _ctx, tileMap.legsUnderGrass( p ) );
      _ctx.globalCompositeOperation = 'destination-over';
      _ctx.fillStyle = 'rgb( 155, 188, 15 )';
      _ctx.fillRect( tileMap.x, tileMap.y, tileMap.w16 * 16, tileMap.h16 * 16 );
      _ctx.globalCompositeOperation = 'source-over';
      outputController.testRender( _ctx );
    }

    requestAnimationFrame( gameLoop2 );
  }
  gameLoop2();
}
