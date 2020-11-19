import { Rect, Point } from '.';

export class TileMap {
  private tileMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  private renderCount = 0;
  private animationStage = 0;
  constructor(
    private tileDimensions: Point,
    private src: HTMLImageElement,
    private sRect: Rect,
    private imgs: HTMLImageElement[] = [],
    private shorelineImgs: HTMLImageElement[] = [],
    public offsetx = 16 * 4,
    public offsety = 16 * 4,
  ) {}

  public render( ctx: CanvasRenderingContext2D ): void {
    if ( this.renderCount % 20 === 0 ) {
      this.animationStage =
        this.animationStage < 2 ? this.animationStage + 1 : 0;
    }
    ctx.drawImage(
      this.src,
      this.sRect.x,
      this.sRect.y,
      this.sRect.w,
      this.sRect.h,
      this.offsetx,
      this.offsety,
      this.sRect.w,
      this.sRect.h,
    );

    // for ( let i = 0; i < this.tileDimensions.x; i++ ) {
    //   for ( let j = 0; j < this.tileDimensions.y; j++ ) {
    //     ctx.drawImage(
    //       this.tileImgs[0],
    //       0,
    //       0,
    //       16,
    //       16,
    //       this.offsetx + 16 * i,
    //       this.offsety + 16 * j,
    //       16,
    //       16,
    //     );
    //   }
    // }
    // for ( let i = 0; i < this.imgs.length; i++ ) {
    //   ctx.drawImage( this.imgs[i], 0, 0, 8, 8, 8 * i, 0, 8, 8 );
    // }
    for( let i = 0; i < 4; i++ ) {
      ctx.drawImage(
        this.imgs[15 + this.animationStage],
        0,
        0,
        8,
        8,
        this.offsetx + 16*6 + 8*i,
        this.offsety + 16*4 + ( i%2 != 0 ? 8 : 0 ),
        8,
        8,
      );
    }

    for( let i = 0; i < 8; i++ ) {
      for( let j = 0; j < 6; j++ ) {
        ctx.drawImage(
          this.imgs[10 + this.animationStage],
          0,
          0,
          8,
          8,
          this.offsetx + 8*i,
          this.offsety + 16*5 + 8*j,
          8,
          8,
        );
      }
    }
    for( let i = 0; i < 8; i++ ) {
      ctx.drawImage(
        this.shorelineImgs[3],
        0, 0, 8, 8, this.offsetx + 8*i,
        this.offsety + 16*5,
        8, 8
      );
    }
    for( let i = 0; i < 5; i++ ) {
      ctx.drawImage(
        this.shorelineImgs[7],
        0, 0, 8, 8, this.offsetx + 16*3.5,
        this.offsety + 16*5.5 + 8*i, 8, 8
      );
    }

    this.renderCount++;
  }

  public getTileDimensions(): Point {
    return this.tileDimensions;
  }
  public getTileMatrix(): number[][] {
    return this.tileMatrix;
  }
  public checkTile( x: number, y: number ): boolean {
    if (
      x < 0 ||
      y < 0 ||
      x === this.tileDimensions.x ||
      y === this.tileDimensions.y ||
      this.tileMatrix[y][x] === 1
    ) {
      return false;
    }
    return true;
  }
}
