import { Rect, Point } from '.';

export class TileMap {
  constructor(
    private tileDimensions: Point,
    private src: HTMLImageElement,
    private sRect: Rect,
  ) {}

  public render( ctx: CanvasRenderingContext2D ): void {
    ctx.drawImage(
      this.src,
      this.sRect.x,
      this.sRect.y,
      this.sRect.w,
      this.sRect.h,
      0,
      0,
      this.sRect.w,
      this.sRect.h,
    );
  }
}
