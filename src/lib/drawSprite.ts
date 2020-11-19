import { Rect } from '.';

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  src: HTMLImageElement,
  rect: Rect,
  dx: number,
  dy: number,
): void {
  ctx.drawImage( src, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w, rect.h );
}
