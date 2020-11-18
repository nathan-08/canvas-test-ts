import { Direction } from '.';

export class Player {
  dir: Direction = Direction.down;
  isMoving = false;
  constructor( public x: number, public y: number ) {}
}
