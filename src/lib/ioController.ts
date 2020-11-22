import { Direction, Player, AnimationController } from '.';
import { ITileMap, IRenderFlags } from '../types';
import { OutputController } from './outputController';
import { getFadeInAction, getFadeOutAction } from '../actions';

interface IKeys {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}
export class IOController {
  // inherit event listeners from base class

  private keys: IKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    s: false,
    d: false,
  };

  public getKeys(): IKeys {
    return this.keys;
  }

  constructor() {
    document.addEventListener( 'keydown', this.handleKeyDown.bind( this ) );
    document.addEventListener( 'keyup', this.handleKeyUp.bind( this ) );
  }

  private handleKeyDown( e: KeyboardEvent ): void {
    switch ( e.key ) {
      case 'ArrowUp': this.keys.up = true; break;
      case 'ArrowDown': this.keys.down = true; break;
      case 'ArrowLeft': this.keys.left = true; break;
      case 'ArrowRight': this.keys.right = true; break;

      case 'a': this.keys.a = true; break;
      case 's': this.keys.s = true; break;
      case 'd': this.keys.d = true; break;
    }
  }

  private handleKeyUp( e: KeyboardEvent ): void {
    switch ( e.key ) {
      case 'ArrowUp': this.keys.up = false; break;
      case 'ArrowDown': this.keys.down = false; break;
      case 'ArrowLeft': this.keys.left = false; break;
      case 'ArrowRight': this.keys.right = false; break;

      case 'a': this.keys.a = false; break;
      case 's': this.keys.s = false; break;
      case 'd': this.keys.d = false; break;
    }
  }

  public handleInput(
    p: Player,
    tileMap: ITileMap,
    ac: AnimationController,
    oc: OutputController,
    ctx: CanvasRenderingContext2D,
    altCtx: CanvasRenderingContext2D,
    renderFlags: IRenderFlags ): void {
    p.isMoving = false;
    const { keys } = this;
    switch ( true ) {
      case keys.a:
        ac.startAnimation( {
          action: ( n: number ) => {
            if ( n === 8 )
              oc.showDialog = !oc.showDialog;
          },
          frames: 8
        } );
        break;
      case keys.s:
        ac.startAnimation( getFadeOutAction( ctx, altCtx, renderFlags ) );
        break;
      case keys.d:
        ac.startAnimation( getFadeInAction( ctx, altCtx, renderFlags ) );
        break;
      case keys.up:
        p.dir = Direction.up;
        
        if ( tileMap.checkTile( p.tilePos.x, p.tilePos.y - 1 ) ) {
          p.tilePos.y--;
          p.isMoving = true;
        }

        ac.startAnimation( {
          action: () => {
            if ( p.isMoving ) tileMap.y++;
            p.frameIndex = p.dir;
          },
          frames: 8,
          onComplete: () => {
            if ( p.isMoving || keys.up ) {
              ac.startAnimation( {
                action: () => {
                  if ( p.isMoving ) tileMap.y++;
                  p.frameIndex = p.step ? 5 : 3;
                },
                frames: 8,
                onComplete: () => p.step = !p.step,
              } );
            }
          },
        } );

        break;
        case keys.down: 
          p.dir = Direction.down;
          if ( tileMap.checkTile( p.tilePos.x, p.tilePos.y + 1 ) ) {
            p.tilePos.y++;
            p.isMoving = true;
          }

          ac.startAnimation( {
            action: () => {
              if ( p.isMoving ) tileMap.y--;
              p.frameIndex = p.dir;
            },
            frames: 8,
            onComplete: () => {
              if ( p.isMoving || keys.down ) {
                ac.startAnimation( {
                  action: () => {
                    if ( p.isMoving ) tileMap.y--;
                    p.frameIndex = p.step ? 0 : 2;
                  },
                  frames: 8,
                  onComplete: () => p.step = !p.step,
                } );
              }
            }
          } );
        break;
        case keys.left: 
          p.dir = Direction.left;
          if ( tileMap.checkTile( p.tilePos.x - 1, p.tilePos.y ) ) {
            p.tilePos.x--;
            p.isMoving = true;
          }

          ac.startAnimation( {
            action: () => {
              if ( p.isMoving ) tileMap.x++;
              p.frameIndex = p.dir;
            },
            frames: 8,
            onComplete: () => {
              if ( p.isMoving || keys.down ) {
                ac.startAnimation( {
                  action: () => {
                    if ( p.isMoving ) tileMap.x++;
                    p.frameIndex = 7;
                  },
                  frames: 8,
                } );
              }
            }
          } );
          break;
        case keys.right: 
          p.dir = Direction.right;
          if ( tileMap.checkTile( p.tilePos.x + 1, p.tilePos.y ) ) {
            p.tilePos.x++;
            p.isMoving = true;
          }

          ac.startAnimation( {
            action: () => {
              if ( p.isMoving ) tileMap.x--;
              p.frameIndex = p.dir;
            },
            frames: 8,
            onComplete: () => {
              if ( p.isMoving || keys.down ) {
                ac.startAnimation( {
                  action: () => {
                    if ( p.isMoving ) tileMap.x--;
                    p.frameIndex = 9;
                  },
                  frames: 8,
                } );
              }
            }
          } );
          break;
    }
    p.frameIndex = p.dir;
    return;
  }
}
