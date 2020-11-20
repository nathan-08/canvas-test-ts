import { Direction, Point, Rect } from '.';

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

  constructor(
    public x: number,
    public y: number,
    public tilePos: Point,
    private src: HTMLImageElement,
  ) {
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 128;
    this.canvas.height = 16;
    this.canvas.setAttribute(
      'style',
      `image-rendering: pixelated; width: ${128 * 4}px; height: ${
        16 * 4
      }px; background: rgb(248,248,248);`,
    );
    this.ctx = this.canvas.getContext( '2d' );
    //document.body.appendChild( this.canvas );
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
    // get image data, make transparent
    const imgData = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );
    const keyPixel = imgData.data[0];
    for ( let i = 0; i < imgData.data.length; i += 4 ) {
      if ( imgData.data[i] === keyPixel ) {
        imgData.data[i + 3] = 0; // set alpha to 0
      }
    }
    this.ctx.putImageData( imgData, 0, 0 );
  }

  public render( ctx: CanvasRenderingContext2D ): void {
    ctx.drawImage(
      this.canvas,
      0,
      0,
      16,
      16,
      16*this.tilePos.x,
      16*this.tilePos.y - 4,
      16,
      16,
    );
  }
}
