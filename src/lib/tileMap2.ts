// nature animations start: (231, 47)
import { Point, Player } from '.';
import { ITileMap } from '../types';
export class TileMap2 implements ITileMap {
  private numAnimations = 8;
  private renderCount = 0;
  private animationStage = 0;
  public w16 = 8;
  public h16 = 8;
  public x = 0;
  public y = 0;
  private w = 16;
  private h = 16;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private walkableMap = [
    [ 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 1, 1, 1, 1, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1 ],
  ];
  private tileAtlas2 = [
    [2, 2, 2, 2, 2, 2, 2, 2,  8,11,14,14,14,14,24,26],
    [6, 7, 7, 7, 7, 7, 7, 3,  9,12,15,15,15,15,25,27],
    [6, 7, 7, 7, 7, 7, 7, 3, 10,13,16,16,17,18,28,29],
    [6, 7, 7, 7, 7, 7, 7, 3, 21,23,23,23,19,20,23,22],
    [6, 7, 7, 7, 7, 7, 7, 3,  5, 5, 5, 5, 5, 5,30,31],
    [6, 7, 7, 7, 7, 7, 7, 3,  5, 4, 5, 5, 5, 4,32,33],
    [4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5,30,31],
    [4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5,32,33],
    [4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5,30,31],
    [4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 4,32,33],
    [4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5,30,31],
    [4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 5,32,33],
    [4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5,30,31],
    [4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 4,32,33],
    [4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5,30,31],
    [4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5,32,33],
  ];
  private tileHash: { [index: number]: Point | { [index:number]: Point } } = {
    0: new Point( 8*12, 8*2 ), // rough grass
    1: {
        0: new Point( 16*9.5, 8  ), // flower animations
        1: new Point( 16*9.5, 8  ),
        2: new Point( 16*9.5, 8*2 ),
        3: new Point( 16*9.5, 0  ),

        4: new Point( 16*9.5, 8  ), // flower animations
        5: new Point( 16*9.5, 8  ),
        6: new Point( 16*9.5, 8*2 ),
        7: new Point( 16*9.5, 0  ),
    },
    2: new Point( 8*3, 8*3 ), // top shoreline
    3: new Point( 8*4, 8*5 ), // right shoreline
    4: new Point( 8*9, 8*3 ), // grass
    5: new Point( 0, 0 ), //blank
    6: new Point( 8*2, 8*3 ), // left shoreline
    7: { // water animation

        0: new Point( 16*9, 8*0 ),
        1: new Point( 16*9, 8*1 ),
        2: new Point( 16*9, 8*2 ),
        3: new Point( 16*9, 8*3 ),
        
        4: new Point( 16*9, 8*4 ),
        5: new Point( 16*9, 8*3 ),
        6: new Point( 16*9, 8*2 ),
        7: new Point( 16*9, 8*1 ),
    },
    8: new Point( 8*5, 8*0 ), // roof 1
    9: new Point( 8*5, 8*1 ), // roof 2
    10: new Point( 8*5, 8*2 ), // roof 3
    11: new Point( 8*6, 8*0 ), // roof 
    12: new Point( 8*6, 8*1 ), // roof  
    13: new Point( 8*6, 8*2 ), // roof  
    14: new Point( 8*7, 8*0 ), // roof  
    15: new Point( 8*7, 8*1 ), // roof  
    16: new Point( 8*10, 8*0 ), // window  
    17: new Point( 8*11, 8*0 ), // door a
    18: new Point( 8*12, 8*0 ), // door b
    19: new Point( 8*11, 8*1 ), // door c
    20: new Point( 8*12, 8*1 ), // door d
    21: new Point( 8*14, 8*4 ), //  house bottom left
    22: new Point( 8*15, 8*4 ), //  house bottom right
    23: new Point( 8*10, 8*1 ), // house bottom mid
    24: new Point( 8*8, 8*0 ), // roof right
    25: new Point( 8*8, 8*1 ), // roof right
    26: new Point( 8*9, 8*0 ), // roof right
    27: new Point( 8*9, 8*1 ), // roof right
    28: new Point( 8*8, 8*2 ), // roof right
    29: new Point( 8*9, 8*2 ), // roof right
    30: new Point( 8*0, 8*4 ), // tree
    31: new Point( 8*1, 8*4 ), // tree
    32: new Point( 8*0, 8*5 ), // tree
    33: new Point( 8*1, 8*5 ), // tree
    34: new Point( 8*2, 8*5 ), // tall grass!
  };
  constructor( private src: HTMLImageElement ) {
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 256;
    this.canvas.height = 128;
    this.canvas.setAttribute(
      'style',
      'image-rendering: pixelated; height: 512px; width: 1024px; background: rgb(0, 0, 255);',
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
    // make data on cavnas transparent
    const imgData = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );
    const keyPixel = imgData.data[0];
    for ( let i = 0; i < imgData.data.length; i += 4 ) {
        if ( imgData.data[i] === keyPixel ) {
            imgData.data[i + 3] = 0; // set alpha to 0
        }
    }
    this.ctx.putImageData( imgData, 0, 0 );
  }
  public checkTile( x: number, y: number ): boolean {
    if ( x < 0 || x === this.w16 || y < 0 || y === this.h16 ) return false;
    return this.walkableMap[y][x] === 0;
  }
  public render( ctx: CanvasRenderingContext2D ): void {
    if ( this.renderCount % 30 === 0 ) {
        this.animationStage++;
        if ( this.animationStage === this.numAnimations ) { // TODO get num animations (hardcoded)
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
  public legsUnderGrass( p: Player ): boolean {
    const px = p.tilePos.x * 2 + 1;
    const py = p.tilePos.y * 2 + 1;
    const tileVal = this.tileAtlas2[py][px];
    return tileVal === 34;
  }
}
