import { BaseMap } from '.';
import { ITileMap, IAnimation } from '../types';
import { NPC, Point, Rect, AnimationController, OutputController, Player, Direction } from '../lib';

export class TownMap extends BaseMap implements ITileMap {
  private numAnimations = 8;
  private renderCount = 0;
  private animationStage = 0;
  public w16 = 12;
  public h16 = 28;
  public x = 0;
  public y = 0;
  private w = 24;
  private h = 56;
  protected interactiveTiles: { [x: number]: { [y: number]: ( d: Direction ) => IAnimation[] }} = {
    7: {
      5: ( d: Direction ): IAnimation[] => {
        if ( d === Direction.up ) {
          return this.oc.createTextActionSequence( "N's House" );
        }
      },
    }
  }
  constructor(
    private doorAction: () => IAnimation[],
    private doorAction2: () => IAnimation[],
    private oc: OutputController,
    private npcCanvas: HTMLCanvasElement,
    private p: Player,
    private ac: AnimationController,
    ) {
    super();
  }
  private mapFrames: HTMLCanvasElement[] = [];
  public render( ctx: CanvasRenderingContext2D, src: HTMLCanvasElement ): void {
    if ( this.renderCount % 30 === 0 ) {
        this.animationStage++;
        if ( this.animationStage === this.mapFrames.length ) {
            this.animationStage = 0;
        }
    }
    // render from 
    const canvas = this.mapFrames[this.animationStage];
    const xoffset = this.x < 0 ? Math.abs( this.x ) : 0;
    const yoffset = this.y < 0 ? Math.abs( this.y ) : 0;
    const x_extent = Math.min( xoffset + 10 * 16, canvas.width );
    const y_extent = Math.min( yoffset + 9 * 16, canvas.height );
    ctx.drawImage( // draw from prerendered canvases
      canvas,
      xoffset,
      yoffset,
      x_extent,
      y_extent,
      this.x > 0 ? this.x : 0,//this.x,
      this.y > 0 ? this.y : 0,//this.y,
      x_extent,
      y_extent,
    );
    // render NPC's if on visible screen
    this.npcs.forEach( npc => {
      if (
        ( npc.tilePos.x >= this.p.tilePos.x - 4
          && npc.tilePos.x <= this.p.tilePos.x + 5
          )
        &&
        ( npc.tilePos.y >= this.p.tilePos.y - 4
          && npc.tilePos.y <= this.p.tilePos.y + 4
          )
        ) {
          npc.render( ctx, this.x, this.y );
        }
    } );
    this.renderCount++;
  }
  public preRender( src: HTMLCanvasElement ): void {
    for ( let i = 0; i < this.numAnimations; i++ ) {
      const canvas = document.createElement( 'canvas' );
      canvas.width = this.w16 * 16;
      canvas.height = this.h16 * 16;
      this._render( canvas.getContext( '2d' ), src, i );
      this.mapFrames[i] = canvas;
    }
  }
  private _render( ctx: CanvasRenderingContext2D, src: HTMLCanvasElement, animationStage: number ): void {
    for ( let y = 0; y < this.h; y++ ) { 
      for ( let x = 0; x < this.w; x++ ) {
        let sx, sy;
        const atlas = this.tileHash[this.tileAtlas2[y][x]];
        if ( atlas instanceof Point ) {
            sx = atlas.x;
            sy = atlas.y;
        } else {
            sx = atlas[animationStage].x;
            sy = atlas[animationStage].y;
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
  protected npcs = [
    new NPC(
      this.npcCanvas,
      new Rect( 16, 16, 16, 16 ),
      new Point( 6,2 ),
      this.oc,
      this,
      this.p,
      this.ac,
      'girl',
    ),
    new NPC(
      this.npcCanvas,
      new Rect( 16, 16*2, 16, 16 ),
      new Point( 2,10 ),
      this.oc,
      this,
      this.p,
      this.ac,
      'boy',
    )
  ];
  public legsUnderGrass( p: Player ): boolean {
    // const px = p.tilePos.x * 2 + 1;
    // const py = p.tilePos.y * 2 + 1;
    // const tileVal = this.tileAtlas2[py][px];
    // return tileVal === 34;
    return false;
  }
  protected actionMap: ( () => IAnimation[] )[][] = [
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, this.doorAction2, null, null, null, null, null, null, null, this.doorAction, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, this.doorAction2, null, null, null, null, null, null, null, this.doorAction, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
  ];
  protected walkableMap = [
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 ],
    [ 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1 ],
    [ 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  ];
  private tileAtlas2 = [
    [ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5],
    [ 6, 7, 7, 7, 7, 7, 7, 7, 7, 3, 5, 5, 5, 4, 5, 5,  5, 4, 5, 5, 5, 4, 5, 5],
    [ 6, 7, 7, 7, 7, 7, 7, 7, 7, 3, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5],
    [ 6, 7, 7, 7, 7, 7, 7, 7, 7, 3, 5, 4, 5, 5, 5, 4,  5, 5, 5, 4, 5, 5, 5, 4],
    [ 6, 7, 7, 7, 7, 7, 7, 7, 7, 3, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5],
    [ 6, 7, 7, 7, 7, 7, 7, 7, 7, 3, 5, 5, 5, 4, 5, 5,  5, 4, 5, 5, 5, 4, 5, 5],
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5],
    [ 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4,  5, 5, 5, 4, 5, 5, 5, 4],

    [ 8,11,14,14,14,14,24,26, 5, 5, 5, 5, 4, 4, 4, 4,  8,11,14,14,14,14,24,26],
    [ 9,12,15,15,15,15,25,27, 5, 4, 5, 5, 4, 4, 4, 4,  9,12,15,15,15,15,25,27],
    [10,13,16,16,17,18,28,29, 5, 5, 5, 5, 4, 4,37,38, 10,13,16,16,17,18,28,29],
    [21,23,23,23,19,20,23,22, 5, 5, 5, 4, 4, 4,39,40, 21,23,23,23,19,20,23,22],
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  1, 0, 1, 0, 5, 5, 5, 5],
    [ 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5,  0, 1, 0, 1, 5, 4, 5, 5],
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5],
    [ 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4,  5, 5, 5, 4, 5, 5, 5, 4],
    [35,35,35,35,35,35,37,38, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [36,36,36,36,36,36,39,40, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 4, 5, 5],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 4, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],

    [ 8,11,14,14,14,14,24,26, 5, 5, 5, 5, 4, 4, 4, 4,  8,11,14,14,14,14,24,26],
    [ 9,12,15,15,15,15,25,27, 5, 4, 5, 5, 4, 4, 4, 4,  9,12,15,15,15,15,25,27],
    [10,13,16,16,17,18,28,29, 5, 5, 5, 5, 4, 4,37,38, 10,13,16,16,17,18,28,29],
    [21,23,23,23,19,20,23,22, 5, 5, 5, 4, 4, 4,39,40, 21,23,23,23,19,20,23,22],
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  1, 0, 1, 0, 5, 5, 5, 5],
    [ 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5,  0, 1, 0, 1, 5, 4, 5, 5],
    [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,  5, 5, 5, 5, 5, 5, 5, 5],
    [ 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5, 5, 4,  5, 5, 5, 4, 5, 5, 5, 4],
    [35,35,35,35,35,35,37,38, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [36,36,36,36,36,36,39,40, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 4, 5, 5],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 0, 1, 0, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 1, 0, 1, 4, 4, 34,34,34,34, 5, 4, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 5],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],
    [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 34,34,34,34, 5, 5, 5, 4],
  ];
  private tileHash: { [index: number]: Point | { [index:number]: Point } } = {
    0: new Point( 8*12, 8*2 ), // rough grass
    1: {
        0: new Point( 16*9.5, 8  ), // flower animations
        1: new Point( 16*9.5, 8  ),
        2: new Point( 16*9.5, 8*2 ),
        3: new Point( 16*9.5, 0  ),

        4: new Point( 16*9.5, 8  ), // flower animations
        5: new Point( 16*9.5, 8  ),
        6: new Point( 16*9.5, 8*2 ),
        7: new Point( 16*9.5, 0  ),
    },
    2: new Point( 8*3, 8*3 ), // top shoreline
    3: new Point( 8*4, 8*5 ), // right shoreline
    4: new Point( 8*9, 8*3 ), // grass
    5: new Point( 0, 0 ), //blank
    6: new Point( 8*2, 8*3 ), // left shoreline
    7: { // water animation

        0: new Point( 16*9, 8*0 ),
        1: new Point( 16*9, 8*1 ),
        2: new Point( 16*9, 8*2 ),
        3: new Point( 16*9, 8*3 ),
        
        4: new Point( 16*9, 8*4 ),
        5: new Point( 16*9, 8*3 ),
        6: new Point( 16*9, 8*2 ),
        7: new Point( 16*9, 8*1 ),
    },
    8: new Point( 8*5, 8*0 ), // roof 1
    9: new Point( 8*5, 8*1 ), // roof 2
    10: new Point( 8*5, 8*2 ), // roof 3
    11: new Point( 8*6, 8*0 ), // roof 
    12: new Point( 8*6, 8*1 ), // roof  
    13: new Point( 8*6, 8*2 ), // roof  
    14: new Point( 8*7, 8*0 ), // roof  
    15: new Point( 8*7, 8*1 ), // roof  
    16: new Point( 8*10, 8*0 ), // window  
    17: new Point( 8*11, 8*0 ), // door a
    18: new Point( 8*12, 8*0 ), // door b
    19: new Point( 8*11, 8*1 ), // door c
    20: new Point( 8*12, 8*1 ), // door d
    21: new Point( 8*14, 8*4 ), //  house bottom left
    22: new Point( 8*15, 8*4 ), //  house bottom right
    23: new Point( 8*10, 8*1 ), // house bottom mid
    24: new Point( 8*8, 8*0 ), // roof right
    25: new Point( 8*8, 8*1 ), // roof right
    26: new Point( 8*9, 8*0 ), // roof right
    27: new Point( 8*9, 8*1 ), // roof right
    28: new Point( 8*8, 8*2 ), // roof right
    29: new Point( 8*9, 8*2 ), // roof right
    30: new Point( 8*0, 8*4 ), // tree
    31: new Point( 8*1, 8*4 ), // tree
    32: new Point( 8*0, 8*5 ), // tree
    33: new Point( 8*1, 8*5 ), // tree
    34: new Point( 8*2, 8*5 ), // tall grass!
    35: new Point( 8*14, 8*0 ), // fence top
    36: new Point( 8*5, 8*5 ), // fence bottom
    37: new Point( 8*6, 8*4 ), // sign top
    38: new Point( 8*7, 8*4 ), // sign top
    39: new Point( 8*6, 8*5 ), // sign bottom
    40: new Point( 8*7, 8*5 ), // sign bottom
  };
}