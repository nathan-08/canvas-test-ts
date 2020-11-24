// nature animations start: (231, 47)
import { Point, Player, applyColorPallette, Direction, NPC } from '.';
import { ITileMap, IAnimation } from '../types';
import { AnimationController } from './animationController';
import { OutputController } from './outputController';
import { Rect } from './rect';

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
  public render( ctx: CanvasRenderingContext2D ): void {
    this.currentMap.render( ctx, this.canvas );
  }
  public legsUnderGrass( p: Player ): boolean {
    return this.currentMap.legsUnderGrass( p );
  }
}
//TODO create base tileMap class
abstract class BaseMap implements ITileMap {
  abstract x: number;
  abstract y: number;
  abstract w16: number;
  abstract h16: number;
  protected npcs: NPC[];
  protected abstract walkableMap: number[][];
  protected abstract actionMap: ( ()=>IAnimation[] )[][];
  protected abstract interactiveTiles: { [x: number]: { [y: number]: ( d: Direction ) => IAnimation[] }};
  public getInteractiveTileAction( p: Player ): IAnimation[] | null {
    let x, y;
    switch ( p.dir ) {
      case Direction.up:
        x = p.tilePos.x;
        y = p.tilePos.y-1;
        break;
      case Direction.down:
        x = p.tilePos.x;
        y = p.tilePos.y+1;
        break;
      case Direction.left:
        x = p.tilePos.x-1;
        y = p.tilePos.y;
        break;
      case Direction.right:
        x = p.tilePos.x+1;
        y = p.tilePos.y;
        break;
    }
    let actions: IAnimation[] = null
    try {
      const f = this.interactiveTiles[x][y];
      actions = f( p.dir );
    }
    catch {}
    if ( !actions ) {
      // check npcs
      const facingNpc = this.npcs.find( npc => npc.tilePos.x === x && npc.tilePos.y === y );
      if ( facingNpc ) {
        actions = facingNpc.getActionSequence( p.dir );
      }
    }
    return actions;
  }
  abstract legsUnderGrass( p: Player ): boolean;
  abstract render( ctx: CanvasRenderingContext2D, src?: HTMLCanvasElement ): void;
  public checkTile( x: number, y: number ) {
    let walkable;
    if ( x < 0 || x === this.w16 || y < 0 || y === this.h16 ) walkable = false;
    else walkable = ( this.walkableMap[y][x] === 0 );
    let action = null;
    try {
      action = this.actionMap[y][x];
    }
    catch {}
    if ( walkable ) {
      if ( this.npcs.some( npc => npc.tilePos.x === x && npc.tilePos.y === y ) ) {
        walkable = false;
      }
    }

    return {
      walkable,
      action,
    }
  }
}
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
  protected npcs: NPC[] = [];
  protected interactiveTiles: { [x: number]: { [y: number]: ( d: Direction ) => IAnimation[] }} = {
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
  private tileHash: { [index: number]: Point | { [index: number]: Point } } = {
    0: new Point( 8 * 1, 0 ),
    1: new Point( 0, 0 ),
    2: new Point( 8 * 4, 0 ), // doormat 
    3: new Point( 8 * 4, 8 ), // doormat 
    4: new Point( 8 * 6, 0 ), // tv
    5: new Point( 8 * 7, 0 ), // tv
    6: new Point( 8 * 6, 8 ), // tv
    7: new Point( 8 * 7, 8 ), // tv
    8: new Point( 8 * 14, 0 ), // snes
    9: new Point( 8 * 15, 0 ), // snes
    10: new Point( 8 * 14, 8 ), // snes
    11: new Point( 8 * 15, 8 ), // snes
    12: new Point( 8*4, 8*2 ), // window
    13: new Point( 8*5, 8*2 ), // window
    14: new Point( 8*4, 8*3 ), // window
    15: new Point( 8*5, 8*3 ), // window
    16: new Point( 8*8, 8*1 ), // plant base
    17: new Point( 8*9, 8*1 ), // plant base
    18: new Point( 8*6, 8*4 ), // plant base
    19: new Point( 8*7, 8*4 ), // plant base
    20: new Point( 8*8, 8*0 ), // plant 
    21: new Point( 8*9, 8*0 ), // plant 
    22: new Point( 8*4, 8*4 ), // plant 
    23: new Point( 8*5, 8*4 ), // plant 
    24: new Point( 8*13, 8*2 ), // bed top
    25: new Point( 8*14, 8*2 ), // bed top
    26: new Point( 8*13, 8*3 ), // bed mid
    27: new Point( 8*14, 8*3 ), // bed mid
    28: new Point( 8*15, 8*3 ), // bed bottom
    29: new Point( 8*15, 8*2 ), // bed bottom
    30: new Point( 8*6, 8*2 ), // bookshelf top left
    31: new Point( 8*9, 8*2 ), // bookshelf top right
    32: new Point( 8*0, 8*3 ), // bookshelf
    33: new Point( 8*1, 8*3 ), // bookshelf
    34: new Point( 8*2, 8*2 ), // bookshelf
    35: new Point( 8*3, 8*2 ), // bookshelf
    36: new Point( 8*2, 8*3 ), // bookshelf
    37: new Point( 8*3, 8*3 ), // bookshelf
  };
  public render( ctx: CanvasRenderingContext2D, src: HTMLCanvasElement ): void {
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
  public legsUnderGrass( _: Player ): boolean { return false; }
}
export class TileMap2 extends BaseMap implements ITileMap { // outdoor map
  private numAnimations = 8;
  private renderCount = 0;
  private animationStage = 0;
  public w16 = 12;
  public h16 = 12;
  public x = 0;
  public y = 0;
  private w = 24;
  private h = 24;
  protected actionMap: ( () => IAnimation[] )[][] = [
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, null, null, null, null, null, null, null, null, null, null ],
    [ null, null, this.doorAction, null, null, null, null, null, null, null, this.doorAction, null ],
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
  ];
  protected interactiveTiles: { [x: number]: { [y: number]: ( d: Direction ) => IAnimation[] }} = {
    7: {
      5: ( d: Direction ): IAnimation[] => {
        if ( d === Direction.up ) {
          return this.oc.createTextActionSequence( "N's House" );
        }
      },
    }
  }
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
  constructor(
    private doorAction: () => IAnimation[],
    private oc: OutputController,
    private npcCanvas: HTMLCanvasElement,
    private p: Player,
    private ac: AnimationController,
    ) {
    super();
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
    )
  ];
  public render( ctx: CanvasRenderingContext2D, src: HTMLCanvasElement ): void {
    if ( this.renderCount % 30 === 0 ) {
        this.animationStage++;
        if ( this.animationStage === this.numAnimations ) {
            this.animationStage = 0;
        }
    }
    for ( let y = 0; y < this.h; y++ ) {
      for ( let x = 0; x < this.w; x++ ) {
        let sx, sy;
        const atlas = this.tileHash[this.tileAtlas2[y][x]];
        if ( atlas instanceof Point ) {
            sx = atlas.x;
            sy = atlas.y;
        } else {
            sx = atlas[this.animationStage].x;
            sy = atlas[this.animationStage].y;
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
    // render NPC's
    this.npcs.forEach( npc => npc.render( ctx, this.x, this.y ) );
    this.renderCount ++;
  }
  public legsUnderGrass( p: Player ): boolean {
    const px = p.tilePos.x * 2 + 1;
    const py = p.tilePos.y * 2 + 1;
    const tileVal = this.tileAtlas2[py][px];
    return tileVal === 34;
  }
}
