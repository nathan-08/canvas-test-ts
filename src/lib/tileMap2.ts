export class TileMap2 {
  private x = 16*3;
  private y = 16*3;
  private h = 4;
  private w = 4;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileAtlas = [
    [0, 1, 0, 1],
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 0, 1, 0],
  ];
  private tileHash: { [index: number]: { x:number, y:number } } = {
    0: { x: 8*12, y: 8*2 },
    1: { x: 8*3,  y: 8*0 },
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
  }
  public render( ctx: CanvasRenderingContext2D ): void {
    for ( let y = 0; y < this.h; y++ ) {
      for ( let x = 0; x < this.w; x++ ) {
        ctx.drawImage(
          this.canvas,
          this.tileHash[this.tileAtlas[y][x]].x,
          this.tileHash[this.tileAtlas[y][x]].y,
          8,
          8,
          this.x + 8 * x,
          this.y + 8 * y,
          8,
          8,
        );
      }
    }
  }
}
