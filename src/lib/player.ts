import { Direction, Point, Rect, applyColorPallette, boySprites, boySprites2, girlSprites } from '.';

export class Player {
  public isMoving = false;
  public animation2 = false;
  public step = false;
  public dir: Direction = Direction.down;
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public frameIndex = 1;

  constructor(
    public tilePos: Point,
    private src: HTMLImageElement,
  ) {
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 128 + 32;
    this.canvas.height = 16 * 3;
    this.canvas.setAttribute(
      'style',
      `image-rendering: pixelated; width: ${
        this.canvas.width * 4}px; height: ${
        this.canvas.height * 4
      }px; background: rgb(0,0,255);`,
    );
    this.ctx = this.canvas.getContext( '2d' );
    // document.body.appendChild( this.canvas );
    for ( let i = 0; i < 10; i++ ) {
      this.ctx.drawImage(
        this.src,
        boySprites[i].x,
        boySprites[i].y,
        16,
        16,
        16 * i,
        0,
        16,
        16,
      );
    }
    for ( let i = 0; i < 10; i++ ) {
      this.ctx.drawImage(
        this.src,
        girlSprites[i].x,
        girlSprites[i].y,
        16,
        16,
        16 * i,
        16 * 1,
        16,
        16,
      );
    }
    for ( let i = 0; i < 10; i++ ) {
      this.ctx.drawImage(
        this.src,
        boySprites2[i].x,
        boySprites2[i].y,
        16,
        16,
        16 * i,
        16 * 2,
        16,
        16,
      );
    }
    const imgData = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );
    applyColorPallette( imgData, true );
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
