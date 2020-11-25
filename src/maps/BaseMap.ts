import { ITileMap, IAnimation } from '../types';
import { Player, Direction, NPC } from '../lib';

export abstract class BaseMap implements ITileMap {
  abstract x: number;
  abstract y: number;
  abstract w16: number;
  abstract h16: number;
  protected npcs: NPC[];
  protected abstract walkableMap: number[][];
  protected abstract actionMap: ( ()=>IAnimation[] )[][];
  protected abstract interactiveTiles: { [x: number]: { [y: number]: ( d: Direction ) => IAnimation[] }};
  public getInteractiveTileAction( p: Player ): IAnimation[] | null {
    let x: number, y: number;
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
  public checkTile( x: number, y: number ): { walkable: boolean, action: ()=>IAnimation[] } {
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
  public abstract preRender( src: HTMLCanvasElement ): void;
}