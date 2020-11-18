import { Direction, Point } from '.';

export class Player {
  public isMoving = false;
  public step = false;
  public dir: Direction = Direction.down;
  constructor( public x: number, public y: number, public tilePos: Point ) {}
}
