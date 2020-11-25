import { BaseMap, houseTileHash } from '.';
import { ITileMap, IAnimation } from '../types';
import { OutputController, Direction, NPC, Point, Player } from '../lib';

export class HouseMap extends BaseMap implements ITileMap {
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
  protected interactiveTiles = {
    0: {
      1: ( d: Direction ): IAnimation[] => {
        if ( d === Direction.up ) {
          return this.oc.createTextActionSequence( "It's full of books." );
        }
      }
    },
    1: {
      1: ( d: Direction ): IAnimation[] => {
        if ( d === Direction.up ) {
          return this.oc.createTextActionSequence( "It's full of books." );
        }
      }
    },
    2: {
      4: ( d: Direction ): IAnimation[] => {
        if ( d === Direction.up ) {
          return this.oc.createTextActionSequence( "N plays the SNES... \nTime to go!" );
        }
      },

    }
  };
  private tileHash = houseTileHash;
  private mapFrames: HTMLCanvasElement[] = [];
  public preRender( src: HTMLCanvasElement ): void {
    // only one animation
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
    )
  }
  public legsUnderGrass( _: Player ): boolean { return false; }
  protected walkableMap = [
    [ 1, 1, 1, 1, 1, 1, 1, 1, ],
    [ 1, 1, 0, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 1, ],
    [ 0, 0, 1, 0, 0, 0, 0, 1, ],
    [ 0, 0, 1, 0, 0, 0, 0, 0, ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, ],
    [ 1, 0, 0, 0, 0, 0, 0, 1, ],
    [ 1, 0, 0, 0, 0, 0, 0, 1, ],
  ];
  protected actionMap: ( () => IAnimation[] )[][] = [
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null ],
    [ null, null, null, null, this.doorAction, this.doorAction, null, null ],
  ];
  private tileAtlas = [
    [30,31,30,31, 1, 1, 1, 1,  1, 1,12,13, 1, 1,12,13 ],
    [32,33,32,33, 1, 1, 1, 1,  1, 1,14,15, 1, 1,14,15 ],
    [34,35,34,35, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0 ],
    [36,37,36,37, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0,24,25 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0,26,27 ],
    [ 0, 0, 0, 0, 4, 5, 0, 0,  0, 0, 0, 0, 0, 0,26,27 ],
    [ 0, 0, 0, 0, 6, 7, 0, 0,  0, 0, 0, 0, 0, 0,28,29 ],

    [ 0, 0, 0, 0, 8, 9, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0,10,11, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0 ],
    [22,23, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0,22,23 ],
    [20,21, 0, 0, 0, 0, 0, 0,  0, 0, 0, 0, 0, 0,20,21 ],
    [18,19, 0, 0, 0, 0, 0, 0,  2, 2, 2, 2, 0, 0,18,19 ],
    [16,17, 0, 0, 0, 0, 0, 0,  3, 3, 3, 3, 0, 0,16,17 ],
  ];
}