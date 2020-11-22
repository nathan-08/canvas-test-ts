import { Direction, Point, Rect, applyColorPallette } from '.';

// girl 16*8.5 // boy 16*2 + 2
const pSprites: Rect[] = [
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
export class Player {
  public isMoving = false;
  public animation2 = false;
  public step = false;
  public dir: Direction = Direction.down;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public frameIndex = 0;

  constructor(
    public tilePos: Point,
    private src: HTMLImageElement,
  ) {
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 128 + 32;
    this.canvas.height = 16;
    this.canvas.setAttribute(
      'style',
      `image-rendering: pixelated; width: ${128 * 4}px; height: ${
        16 * 4
      }px; background: rgb(0,0xff,0);`,
    );
    this.ctx = this.canvas.getContext( '2d' );
    // document.body.appendChild( this.canvas );
    for ( let i = 0; i < 10; i++ ) {
      this.ctx.drawImage(
        this.src,
        pSprites[i].x,
        pSprites[i].y,
        16,
        16,
        16 * i,
        0,
        16,
        16,
      );
    }
    const imgData = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );
    applyColorPallette( imgData );
    this.ctx.putImageData( imgData, 0, 0 );
  }

  public render( ctx: CanvasRenderingContext2D, legsUnderGrass: boolean ): void {
    ctx.drawImage( // draw top
      this.canvas,
      16*this.frameIndex,
      0,
      16,
      8,
      16*4,
      16*4-4,
      16,
      8,
    );

    // determine if legs are under tall grass
    if ( legsUnderGrass )
      ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage( //draw bottom
      this.canvas,
      16*this.frameIndex,
      8,
      16,
      8,
      16*4,
      16*4+4,
      16,
      8,
    );
    ctx.globalCompositeOperation = 'source-over';
  }
}
