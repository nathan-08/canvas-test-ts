import { Rect, Point } from '.';

export class TileMap {
  private tileMatrix = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
  ];
  private renderCount = 0;
  constructor(
    private tileDimensions: Point,
    private src: HTMLImageElement,
    private sRect: Rect,
    public offsetx = 16 * 1,
    public offsety = -16 * 3,
  ) {}

  public render( ctx: CanvasRenderingContext2D ): void {
    this.renderCount = this.renderCount === 3 ? 0 : this.renderCount + 1;
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
