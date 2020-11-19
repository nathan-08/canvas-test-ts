import { Rect, Point, imgDataToImage, drawSprite } from '.';
import { IAnimation } from '../types';
import { getFadeInAnimation, getFadeOutAnimation } from '../actions';

interface ITileData {
  walkable: boolean;
  tileAction: IAnimation;
}
export interface ITileMap {
  init: () => Promise<void>;
  render: ( ctx: CanvasRenderingContext2D ) => void;
  checkTile: ( x: number, y: number ) => boolean;
  checkTile2: ( x: number, y: number ) => ITileData;
  offsetx: number;
  offsety: number;
}

export class RoomMap implements ITileMap {
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
  private tileActionMatrix: IAnimation[][] = [
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, this.doorAction, this.doorAction, null, null, null, null ],
  ];
  private tileDimensions = new Point( this.tileMatrix[0].length, this.tileMatrix.length )
  private renderCount = 0;
  private animationStage = 0;
  private mapImgs: HTMLImageElement[] = []; // map cycles through these on render
  private sRect = new Rect( 8 * 17, 8 * 37 - 2, 8 * 16, 8 * 16 );
  constructor(
    private srcImg: HTMLImageElement,
    private doorAction: IAnimation
    ) {}
  public offsetx = 16 * 4;
  public offsety = 16 * 4;
  public async init(): Promise<void> {
    const canvas = document.createElement( 'canvas' );
    const ctx = canvas.getContext( '2d' );
    canvas.width = this.sRect.w;
    canvas.height = this.sRect.h;
    const promises = [];
    for( let i = 0; i < 1; i++ ) {
      ctx.drawImage(
        this.srcImg,
        this.sRect.x,
        this.sRect.y,
        this.sRect.w,
        this.sRect.h,
        0,
        0,
        this.sRect.w,
        this.sRect.h,
      );
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

    this.renderCount++;
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
  public checkTile2( x: number, y: number ): ITileData {
    const walkable = this.checkTile( x, y );
    let tileAction: IAnimation = null;
    try { tileAction = this.tileActionMatrix[y][x]; }
    finally {}
    //const tileAction = walkable ? this.tileActionMatrix[y][x] : null;
    return {
      walkable,
      tileAction,
    }
  }
}

export class OutdoorMap implements ITileMap {
  // need access to ac, p, mc
  private sRect = new Rect( 16 * 2 + 2, 16 * 2 + 2, 16 * 12, 16 * 8 );
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
  private tileActionMatrix: IAnimation[][] = [
    [ null, null, null, null, null, null, null, null, null, null, null, null, ],
    [ null, null, null, null, null, null, null, null, null, null, null, null, ],
    [ null, null, null, null, null, null, null, null, null, null, null, null, ],
    [ null, null, null, null, null, this.doorAction, null, null, null, null, null, null, ],
    [ null, null, null, null, null, null, null, null, null, null, null, null, ],
    [ null, null, null, null, null, null, null, null, null, null, null, null, ],
    [ null, null, null, null, null, null, null, null, null, null, null, null, ],
    [ null, null, null, null, null, null, null, null, null, null, null, null, ],
  ];

  private tileDimensions = new Point( this.tileMatrix[0].length, this.tileMatrix.length )
  private renderCount = 0;
  private animationStage = 0;
  private mapImgs: HTMLImageElement[] = []; // map cycles through these on render
  public offsetx = 16 * 4;
  public offsety = 16 * 4;

  // ctor get src imgs
  constructor(
    private src: HTMLImageElement,
    private sceneryImgs: HTMLImageElement[] = [],
    private shorelineImgs: HTMLImageElement[] = [],
    private doorAction: IAnimation,
  ) {}
  public async init(): Promise<void> {
    const canvas = document.createElement( 'canvas' );
    const ctx = canvas.getContext( '2d' );
    canvas.width = this.sRect.w;
    canvas.height = this.sRect.h;
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
      // for ( let x = 0; x < this.sceneryImgs.length; x++ ) {
      //   ctx.drawImage( this.sceneryImgs[x], 0, 0, 8, 8, 8 * x, 0, 8, 8 );
      // }
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

  private getTileAction( x: number, y: number ): IAnimation {
    const tileAction = this.tileActionMatrix[y][x];
    return tileAction;
  }

  public checkTile2( x: number, y: number ): ITileData {
    const walkable = this.checkTile( x, y );
    const tileAction = walkable ? this.getTileAction( x, y ) : null;
    return {
      walkable,
      tileAction,
    };
  }
}

export class MapController {
  public mapIndex = 0;
  constructor( private maps: ITileMap[] ) {}
  public setMapIndex( n: number ): void { this.mapIndex = n; }
  public get offsetx(): number { return this.activeMap.offsetx; }
  public set offsetx( n: number ) {
    this.activeMap.offsetx = n;
  }
  public get offsety(): number { return this.activeMap.offsety; }
  public set offsety( n: number ) {
    this.activeMap.offsety = n;
  }
  public checkTile( x: number, y: number ): boolean {
    return this.activeMap.checkTile( x, y );
  }
  public checkTile2( x: number, y: number ): ITileData {
    return this.activeMap.checkTile2( x, y );
  }
  private get activeMap(): ITileMap {
    return this.maps[this.mapIndex];
  }
  public render( ctx: CanvasRenderingContext2D ): void {
    this.activeMap.render( ctx );
  }
}