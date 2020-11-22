import { IAnimation } from ".";

export interface ITileMap {
  checkTile( x: number, y: number ): boolean;
  x: number;
  y: number;
}
