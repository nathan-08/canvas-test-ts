import { Point, Rect, Direction, OutputController } from '.';
import { IAnimation, ITileMap } from '../types';
import { AnimationController } from './animationController';
import { Player } from './player';

export class NPC {
  private d = Direction.down;
  private action: IAnimation;
  private pixelPos: Point;
  private renderCount = 0;
  private animationFrame = this.d;
  private step = false;
  constructor(
    private src: HTMLCanvasElement,
    private canvasPos: Rect,
    public tilePos: Point,
    private oc: OutputController,
    private tileMap: ITileMap,
    private p: Player,
    private ac: AnimationController,
    public name: string,
  ) {
    this.pixelPos = new Point( this.tilePos.x * 16, this.tilePos.y * 16 );
  }
  public render(
    ctx: CanvasRenderingContext2D,
    xoffset: number,
    yoffset: number,
  ): void {
    if ( this.renderCount % 300 === 0 && !this.action ) {
      const randNum = Math.round( Math.random() * 4 );
      let d: Direction;
      switch ( randNum ) {
        case 1: d = Direction.down;
          break;
        case 2: d = Direction.up;
          break;
        case 3: d = Direction.left;
          break;
        case 4: d = Direction.right;
          break;
      }
      const walkTo = new Point( this.tilePos.x, this.tilePos.y );
      this.mutatePointByDirection( walkTo, d );
      if (
          !this.ac.pending
          && !( this.p.tilePos.x === walkTo.x )
          && !( this.p.tilePos.y === walkTo.y )
          && this.tileMap.checkTile( walkTo.x, walkTo.y ).walkable
          ) {
        this.action = this.walk( d );
      }
    }
    if ( this.action ) {
      this.action.action( this.action.frames-- );
      if ( this.action.frames === 0 ) {
        this.action = null;
      }
    }
    ctx.drawImage(
      this.src,
      16 * this.animationFrame,
      this.canvasPos.y,
      this.canvasPos.w,
      this.canvasPos.h,
      this.pixelPos.x + xoffset,
      this.pixelPos.y + yoffset - 4,
      this.canvasPos.w,
      this.canvasPos.h,
    );
    this.renderCount++;
  }
  public getActionSequence( d: Direction ): IAnimation[] {
    switch ( d ) {
      case Direction.up:
        this.d = Direction.down;
        break;
      case Direction.down:
        this.d = Direction.up;
        break;
      case Direction.left:
        this.d = Direction.right;
        break;
      case Direction.right:
        this.d = Direction.left;
        break;
    }
    this.animationFrame = this.d;
    return this.oc.createTextActionSequence( 'Hi there!' );
  }
  private mutatePointByDirection( p: Point | Rect, d: Direction ) {
    switch ( d ) {
      case Direction.up:
        p.y--;
        break;
      case Direction.down:
        p.y++;
        break;
      case Direction.left:
        p.x--;
        break;
      case Direction.right:
        p.x++;
        break;
    }
  }
  private walk( d: Direction ): IAnimation {
    return {
      frames: 16,
      action: ( n: number ) => {
        switch ( n ) {
          case 16:
            this.mutatePointByDirection( this.tilePos, d );
            this.d = d;
            this.animationFrame = this.d;
            break;
          case 8:
              switch ( d ) {
                  case Direction.up:
                      this.animationFrame = this.step ? 5 : 3;
                      break;
                  case Direction.down:
                      this.animationFrame = this.step ? 0 : 2;
                      break;
                  case Direction.left:
                      this.animationFrame = 7;
                      break;
                  case Direction.right:
                      this.animationFrame = 9;
                      break;
              }
          break;
          case 1:
              this.animationFrame = this.d;
              this.step = !this.step;
              break;
        }
        this.mutatePointByDirection( this.pixelPos, d );
        return true;
      },
    };
  }
}

export const boySprites: Rect[] = [
  new Rect( 16 * 0 + 9, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 1 + 10, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 2 + 11, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 3 + 12, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 4 + 13, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 5 + 14, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 6 + 15, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 7 + 16, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 8 + 17, 16 * 2 + 2, 16, 16 ),
  new Rect( 16 * 9 + 18, 16 * 2 + 2, 16, 16 ),
];
export const girlSprites: Rect[] = [
  new Rect( 16 * 0 + 9, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 1 + 10, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 2 + 11, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 3 + 12, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 4 + 13, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 5 + 14, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 6 + 15, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 7 + 16, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 8 + 17, 16 * 8.5, 16, 16 ),
  new Rect( 16 * 9 + 18, 16 * 8.5, 16, 16 ),
];
export const boySprites2: Rect[] = [
  new Rect( 16 * 0 + 9,  16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 1 + 10, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 2 + 11, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 3 + 12, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 4 + 13, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 5 + 14, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 6 + 15, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 7 + 16, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 8 + 17, 16 * 5.5-3 , 16, 16 ),
  new Rect( 16 * 9 + 18, 16 * 5.5-3 , 16, 16 ),
];
