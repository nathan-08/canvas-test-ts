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

window.onload = main;

async function main(): Promise<void> {
  const canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;
  canvas.setAttribute(
    'style',
    'border: 0px solid blue; image-rendering: pixelated; height: 512px; width: 512px; background: rgb(0, 0, 0)',
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

  // GAME LOOP //
  function gameLoop2() {
    if ( ac.ready ) {
      io.handleInput( p, tileMap, ac, outputController );
    }
    ac.step();
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    tileMap.render( ctx );
    p.render( ctx, tileMap.legsUnderGrass( p ) );
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgb( 248, 248, 248 )';
    ctx.fillRect( tileMap.x, tileMap.y, tileMap.w16 * 16, tileMap.h16 * 16 );
    ctx.globalCompositeOperation = 'source-over';
    outputController.testRender( ctx );
    requestAnimationFrame( gameLoop2 );
  }
  gameLoop2();
}
