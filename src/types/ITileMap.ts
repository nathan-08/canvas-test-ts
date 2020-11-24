import { IAnimation } from ".";
import { Player } from '../lib';

export interface ITileMap {
  checkTile( x: number, y: number ): { walkable: boolean, action: ()=>IAnimation[] };
  render( ctx: CanvasRenderingContext2D, src?: HTMLCanvasElement ): void;
  legsUnderGrass( p: Player ): boolean;
  x: number;
  y: number;
  w16: number;
  h16: number;
}
