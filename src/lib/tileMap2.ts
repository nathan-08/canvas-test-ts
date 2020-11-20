// nature animations start: (231, 47)
import { Point } from '.';
export class TileMap2 {
  private renderCount = 0;
  private animationStage = 0;
  private x = 0;
  private y = 0;
  private w = 8;
  private h = 16;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileAtlas = [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
  ];
  private tileAtlas2 = [
    [4, 5, 4, 5, 4, 5, 4, 5],
    [5, 4, 5, 4, 5, 4, 5, 4],
    [4, 5, 1, 0, 1, 0, 4, 5],
    [5, 4, 0, 1, 0, 1, 5, 4],
    [4, 5, 1, 0, 1, 0, 4, 5],
    [5, 4, 0, 1, 0, 1, 5, 4],
    [4, 5, 4, 5, 4, 5, 4, 5],
    [5, 4, 5, 4, 5, 4, 5, 4],
    [4, 5, 4, 5, 4, 5, 4, 5],
    [5, 4, 5, 4, 5, 4, 5, 4],
    [4, 5, 1, 0, 1, 0, 4, 5],
    [5, 4, 0, 1, 0, 1, 5, 4],
    [4, 5, 1, 0, 1, 0, 4, 5],
    [5, 4, 0, 1, 0, 1, 5, 4],
    [4, 5, 4, 5, 4, 5, 4, 5],
    [5, 4, 5, 4, 5, 4, 5, 4],
  ];
  private tileHash: { [index: number]: Point | { [index:number]: Point } } = {
    0: new Point( 8*12, 8*2 ), // rough grass
    1: {
        0: new Point( 16*9.5, 8  ), // flower animations
        1: new Point( 16*9.5, 8  ),
        2: new Point( 16*9.5, 8*2 ),
        3: new Point( 16*9.5, 0  ),
    },
    4: new Point( 8*9, 8*3 ), // grass
    5: new Point( 0, 0 ) //blank
  };
  constructor( private src: HTMLImageElement ) {
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 256;
    this.canvas.height = 128;
    this.canvas.setAttribute(
      'style',
      'image-rendering: pixelated; height: 512px; width: 1024px; background: black;',
    );
    document.body.appendChild( this.canvas );
    this.ctx = this.canvas.getContext( '2d' );
    this.ctx.drawImage(
      this.src,
      2,
      16 * 11,
      16 * 8,
      16 * 3,
      0,
      0,
      16 * 8,
      16 * 3,
    );
    for( let i = 0; i < 5; i++ ) { // draw animated map tiles
        for( let j = 0; j < 4; j++ ) {
            this.ctx.drawImage(
                this.src,
                231 + 10*j,
                47  + 10*i,
                8,
                8,
                16*8 + 8*j,
                0    + 8*i,
                8,
                8  
            );
        }
    }
    // this.ctx.drawImage(
    //     this.src,
    //     231,
    //     47,
    //     16*3,
    //     16*4,
    //     16*8,
    //     0,
    //     16*3,
    //     16*4
    // );
  }
  public render( ctx: CanvasRenderingContext2D ): void {
    if ( this.renderCount % 20 === 0 ) {
        this.animationStage++;
        if ( this.animationStage === 4 ) { // TODO get num animations (hardcoded)
            this.animationStage = 0;
        }
    }
    for ( let y = 0; y < this.h; y++ ) {
      for ( let x = 0; x < this.w; x++ ) {
        let sx, sy;
        const atlas = this.tileHash[this.tileAtlas2[y][x]];
        if ( atlas instanceof Point ) {
            sx = atlas.x;
            sy = atlas.y;
        } else {
            sx = atlas[this.animationStage].x;
            sy = atlas[this.animationStage].y;
        }
        ctx.drawImage(
          this.canvas,
          sx,//this.tileHash[this.tileAtlasArr[this.animationStage][y][x]].x,
          sy,//this.tileHash[this.tileAtlasArr[this.animationStage][y][x]].y,
          8,
          8,
          this.x + 8 * x,
          this.y + 8 * y,
          8,
          8,
        );
      }
    }
    this.renderCount ++;
  }
}
