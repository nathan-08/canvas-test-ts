import { ITileMap, IAnimation } from '../types';
import { applyColorPallette, Player } from '../lib';

export class MapController implements ITileMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  constructor(
    private maps: ITileMap[],
    private mapIndex = 0,
    private src: HTMLImageElement,
  ) {
    // set up map canvas
    this.canvas = document.createElement( 'canvas' );
    this.canvas.width = 256;
    this.canvas.height = 128;
    this.canvas.setAttribute(
      'style',
      'image-rendering: pixelated; height: 512px; width: 1024px; background: rgb(248,248,248);',
    );
    // document.body.appendChild( this.canvas );
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
    for( let i = 0; i < 5; i++ ) { // draw animated map tiles
        for( let j = 0; j < 4; j++ ) {
            this.ctx.drawImage(
                this.src,
                231 + 10*j,
                47  + 10*i,
                8,
                8,
                16*8 + 8*j,
                0    + 8*i,
                8,
                8  
            );
        }
    }
    this.ctx.drawImage( // room map
      this.src,
      2,
      16 * 14.5 + 2,
      16 * 8,
      16 * 3,
      0,
      16 * 3,
      16 * 8,
      16 * 3,
    );
    const imgData = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );
    applyColorPallette( imgData );
    this.ctx.putImageData( imgData, 0, 0 );
    this.preRender( this.canvas );
  }
  public getInteractiveTileAction( p: Player ): IAnimation[] | null {
    return this.currentMap.getInteractiveTileAction( p );
  }
  private get currentMap() { return this.maps[this.mapIndex]; }
  public setMapIndex( x: number ):void { this.mapIndex = x; }
  public get w16(): number { return this.currentMap.w16; }
  public get h16(): number { return this.currentMap.h16; }
  public get x(): number { return this.currentMap.x; }
  public set x( x: number ) { this.currentMap.x = x; }
  public get y(): number { return this.currentMap.y; }
  public set y( y: number ) { this.currentMap.y = y; }
  public checkTile( x: number, y: number ): { walkable: boolean, action: ()=>IAnimation[] } {
    return this.currentMap.checkTile( x, y );
  }
  public preRender( canvas: HTMLCanvasElement ): void {
    for ( let i = 0; i < this.maps.length; i++ ) {
      this.maps[i].preRender( canvas );
    }
  }
  public render( ctx: CanvasRenderingContext2D ): void {
    this.currentMap.render( ctx, this.canvas );
  }
  public legsUnderGrass( p: Player ): boolean {
    return this.currentMap.legsUnderGrass( p );
  }
}