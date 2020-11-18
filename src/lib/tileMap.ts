import { Rect, Point } from '.';

export class TileMap {
  constructor(
    private tileDimensions: Point,
    private src: HTMLImageElement,
    private sRect: Rect,
    private obs: Point[] = [
        new Point( 0, 0 ), // left shelves
        new Point( 0, 1 ),
        new Point( 1, 0 ),
        new Point( 1, 1 ),
        new Point( 2, 0 ),
        new Point( 3, 0 ),
        new Point( 4, 0 ),
        new Point( 5, 0 ),
        new Point( 6, 0 ),

        new Point( 7, 0 ), // right shelf
        new Point( 7, 1 ),

        new Point( 3, 3 ), // table
        new Point( 3, 4 ),
        new Point( 4, 3 ),
        new Point( 4, 4 ),

        new Point( 0, 6 ), // left plant
        new Point( 0, 7 ),
        new Point( 7, 6 ), // right plant
        new Point( 7, 7 ),
    ],
    public offsetx = 16*1,
    public offsety = -16*3,
  ) {}

  public render( ctx: CanvasRenderingContext2D ): void {
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
  }

  public getTileDimensions(): Point { return this.tileDimensions; }
  public getObs(): Point[] { return this.obs; }
}
