import { BaseMap, houseTileHash } from '.';
import { ITileMap, IAnimation } from '../types';
import { OutputController, NPC, Point, Player } from '../lib';

export class HouseMap2 extends BaseMap implements ITileMap {
  constructor(
    private doorAction: ()=>IAnimation[],
    private oc: OutputController,
  ) {
    super();
  }
  public x = 0;
  public y = 0;
  public w16 = 8;
  public h16 = 8;
  protected npcs: NPC[] = [];
  protected interactiveTiles = {};
  private tileHash = houseTileHash;
  private mapFrames: HTMLCanvasElement[] = [];
  public preRender( src: HTMLCanvasElement ): void {
    const canvas = document.createElement( 'canvas' );
    canvas.width = this.w16 * 16;
    canvas.height = this.h16 * 16;
    this._render( canvas.getContext( '2d' ), src );
    this.mapFrames.push( canvas );
  }
  private _render( ctx: CanvasRenderingContext2D, src: HTMLCanvasElement ): void {
    const srcYOffset = 16 * 3; // tileset for this room beings at 16 * 3 (y)
    for ( let y = 0; y < this.h16*2; y++ ) {
      for ( let x = 0; x < this.w16*2; x++ ) {
        let sx, sy;
        const atlas = this.tileHash[this.tileAtlas[y][x]];
        if ( atlas instanceof Point ) {
            sx = atlas.x;
            sy = atlas.y + srcYOffset;
        } else {
          // no animations
        }
        ctx.drawImage(
          src,
          sx,
          sy,
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
  public render( ctx: CanvasRenderingContext2D, src: HTMLCanvasElement ): void {
    const canvas = this.mapFrames[0];
    const xoffset = this.x < 0 ? Math.abs( this.x ) : 0;
    const yoffset = this.y < 0 ? Math.abs( this.y ) : 0;
    const x_extent = Math.min( xoffset + 10*16, canvas.width );
    const y_extent = Math.min( yoffset + 9*16, canvas.height );
    ctx.drawImage(
      this.mapFrames[0],
      xoffset,
      yoffset,
      x_extent,
      y_extent,
      this.x > 0 ? this.x : 0,
      this.y > 0 ? this.y : 0,
      x_extent,
      y_extent,
    );
  }
  public legsUnderGrass( p: Player ): boolean { return false; }
  protected walkableMap = [
    [ 1, 1, 1, 1, 1, 1, 1, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
  ];
  protected actionMap: ( () => IAnimation[] )[][] = [
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,null,null,null,null, ],
    [ null,null,null,null,this.doorAction,this.doorAction,null,null, ],
  ];
  private tileAtlas: number[][] = [
    [ 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, ],
    [ 1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 1, 1, 1, 1, 1, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
  
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0, ],
  ];
}