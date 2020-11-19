import { Rect, Point, imgDataToImage, drawSprite } from '.';

// TODO: create imgs for map 

// interface ITileMapConfig {
//   srcImgs: HTMLImageElement[],
// }
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
  //private srcImgs;
  private mapImgs: HTMLImageElement[] = [];

  // ctor get src imgs
  constructor(
    private tileDimensions: Point,
    private src: HTMLImageElement,
    private sRect: Rect,
    private sceneryImgs: HTMLImageElement[] = [],
    private shorelineImgs: HTMLImageElement[] = [],
    public offsetx = 16 * 4,
    public offsety = 16 * 4,
  ) {}
  // TODO create map imgs
  public async init(): Promise<void> {
    // push to this.mapImgs
    // create a temp canvas, render to it, save as img, then delete temp canvas
    const canvas = document.createElement( 'canvas' );
    const ctx = canvas.getContext( '2d' );
    canvas.width = this.sRect.w;
    canvas.height = this.sRect.h;
    // render to canvas
    const promises = [];
    for( let i = 0; i < 8; i++ ) {
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
      for( let x = 0; x < 8; x++ ) {
        for( let y = 0; y < 6; y++ ) { // for-loop-ception !
          ctx.drawImage(
            this.sceneryImgs[ 10 + ( ()=>{
              switch( i ) {
                case 0: return 0;
                case 1: return 1;
                case 2: return 2;
                case 3: return 3;
                case 4: return 4;
                case 5: return 3;
                case 6: return 2;
                case 7: return 1;
              }
            } )() ],
            0,
            0,
            8,
            8,
            8*x,
            16*5 + 8*y,
            8,
            8,
          );
        }
      }
      for( let x = 0; x < 8; x++ ) {
        ctx.drawImage(
          this.shorelineImgs[3],
          0, 0, 8, 8, 8*x,
          16*5,
          8, 8
        );
      }
      for( let x = 0; x < 5; x++ ) {
        ctx.drawImage(
          this.shorelineImgs[7],
          0, 0, 8, 8, 16*3.5,
          16*5.5 + 8*x, 8, 8
        );
      }
      for ( let x = 0; x < this.sceneryImgs.length; x++ ) {
        ctx.drawImage( this.sceneryImgs[x], 0, 0, 8, 8, 8 * x, 0, 8, 8 );
      }
      for( let x = 0; x < 4; x++ ) { // flowers!
        ctx.drawImage(
          this.sceneryImgs[ 15 + ( function(){
            switch( i ) {
              case 0: return 1;
              case 1: return 2;
              case 2: return 0;
              case 3: return 1;
              case 4: return 1;
              case 5: return 2;
              case 6: return 0;
              case 7: return 1;
            }
          }() ) ],
          0,
          0,
          8,
          8,
          16*6 + 8*x,
          16*4 + ( x%2 != 0 ? 8 : 0 ),
          8,
          8,
        );
      }
      // save image new Image() -> src -> canvas.toDataURL()
      const img = new Image();
      img.src = canvas.toDataURL();
      promises.push(
        new Promise<HTMLImageElement>( ( resolve ) =>
          img.addEventListener( 'load', () => { resolve( img ); } ),
        ),
      );
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    }
    this.mapImgs = await Promise.all( promises );
  }

  public render( ctx: CanvasRenderingContext2D ): void {
    if ( this.renderCount % 20 === 0 ) {
      this.animationStage ++;
      if( this.animationStage === this.mapImgs.length ) this.animationStage = 0;
    }
    ctx.drawImage(
      this.mapImgs[this.animationStage],
      0,
      0,
      this.sRect.w,
      this.sRect.h,
      this.offsetx,
      this.offsety,
      this.sRect.w,
      this.sRect.h,
    );
    // ctx.drawImage(
    //   this.src,
    //   this.sRect.x,
    //   this.sRect.y,
    //   this.sRect.w,
    //   this.sRect.h,
    //   this.offsetx,
    //   this.offsety,
    //   this.sRect.w,
    //   this.sRect.h,
    // );

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
