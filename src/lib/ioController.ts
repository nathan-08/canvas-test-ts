import { Direction, Player, AnimationController, formatText } from '.';
import { ITileMap, IRenderFlags, IAnimation, IKeys } from '../types';
import { OutputController } from './outputController';
import { getFadeInAction } from '../actions';

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
      case 'ArrowUp':
        this.keys.up = true;
        break;
      case 'ArrowDown':
        this.keys.down = true;
        break;
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'ArrowRight':
        this.keys.right = true;
        break;

      case 'a':
        this.keys.a = true;
        break;
      case 's':
        this.keys.s = true;
        break;
      case 'd':
        this.keys.d = true;
        break;
    }
  }

  private handleKeyUp( e: KeyboardEvent ): void {
    switch ( e.key ) {
      case 'ArrowUp':
        this.keys.up = false;
        break;
      case 'ArrowDown':
        this.keys.down = false;
        break;
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'ArrowRight':
        this.keys.right = false;
        break;

      case 'a':
        this.keys.a = false;
        break;
      case 's':
        this.keys.s = false;
        break;
      case 'd':
        this.keys.d = false;
        break;
    }
  }

  public handleInput(
    p: Player,
    tileMap: ITileMap,
    ac: AnimationController,
    oc: OutputController,
    ctx: CanvasRenderingContext2D,
    altCtx: CanvasRenderingContext2D,
    renderFlags: IRenderFlags,
  ): void {
    p.isMoving = false;
    const { keys } = this;
    let tileData, walkable, tileAction: () => IAnimation[];
    let actionSequence: IAnimation[] = [];
    switch ( true ) { // loop over input keys
      case keys.a:
        if ( oc.showDialog ) {
          ac.startActionSequence( [
            {
              frames: 8,
              action: ( n: number ) => {
                if ( n === 8 ) {
                  oc.showDialog = false;
                }
                return true;
              }
            }
          ] );
        } else {
          ac.startActionSequence( oc.createTextActionSequence(
            `The time is: \n${new Date().toLocaleTimeString()}`
          ) );
        }
        break;
      case keys.s:
        ac.startActionSequence( [
          {
            frames: 8,
            action: ( n: number ) => {
              if ( n === 8 ) {
                const res = formatText( 'hello world how are you?' );
                console.log( res );
              }
              return true;
            },
          },
        ] );
        break;
      case keys.d:
        ac.startActionSequence( [getFadeInAction( ctx, altCtx, renderFlags )] );
        break;
      case keys.up:
        p.dir = Direction.up;

        tileData = tileMap.checkTile( p.tilePos.x, p.tilePos.y - 1 );
        walkable = tileData.walkable;
        tileAction = tileData.action;
        if ( walkable ) {
          p.tilePos.y--;
          p.isMoving = true;
        }
        actionSequence = [
          {
            frames: 8,
            action: () => {
              if ( p.isMoving ) tileMap.y++;
              p.frameIndex = p.dir;
              return true;
            },
          },
          {
            frames: 8,
            action: ( n: number ) => {
              if ( n === 8 ) {
                if ( !( p.isMoving || keys.up ) ) {
                  return false;
                }
              }
              if ( p.isMoving ) tileMap.y++;
              p.frameIndex = p.step ? 5 : 3;
              if ( n === 1 ) {
                p.frameIndex = p.dir;
                p.step = !p.step;
              }
              return true;
            },
          },
        ];
        if ( tileAction ) {
          actionSequence.push( ...tileAction() );
        }
        ac.startActionSequence( actionSequence );
        break;
      case keys.down:
        p.dir = Direction.down;
        tileData = tileMap.checkTile( p.tilePos.x, p.tilePos.y + 1 );
        walkable = tileData.walkable;
        tileAction = tileData.action;
        if ( walkable ) {
          p.tilePos.y++;
          p.isMoving = true;
        }

        if ( tileAction ) {
          p.frameIndex = p.dir;
          ac.startActionSequence( [
            {
              frames: 4,
              action: () => true,
            },
            ...tileAction(),
          ] );
        } else {
          actionSequence = [
            {
              frames: 8,
              action: () => {
                if ( p.isMoving ) tileMap.y--;
                p.frameIndex = p.dir;
                return true;
              },
            },
            {
              frames: 8,
              action: ( n: number ) => {
                if ( n === 8 ) {
                  if ( !( p.isMoving || keys.down ) ) {
                    return false;
                  }
                }
                if ( p.isMoving ) tileMap.y--;
                p.frameIndex = p.step ? 0 : 2;
                if ( n === 1 ) {
                  p.frameIndex = p.dir;
                  p.step = !p.step;
                }
                return true;
              },
            },
          ];
          ac.startActionSequence( actionSequence );
        }
        break;
      case keys.left:
        p.dir = Direction.left;
        tileData = tileMap.checkTile( p.tilePos.x - 1, p.tilePos.y );
        walkable = tileData.walkable;
        tileAction = tileData.action;
        if ( walkable ) {
          p.tilePos.x--;
          p.isMoving = true;
        }

        actionSequence = [
          {
            frames: 8,
            action: () => {
              if ( p.isMoving ) tileMap.x++;
              p.frameIndex = p.dir;
              return true;
            },
          },
          {
            frames: 8,
            action: ( n: number ) => {
              if ( n === 8 ) {
                if ( !( p.isMoving || keys.left ) ) {
                  return false;
                }
              }
              if ( p.isMoving ) tileMap.x++;
              p.frameIndex = 7;
              if ( n === 1 ) {
                p.frameIndex = p.dir;
              }
            },
          },
        ];
        if ( tileAction ) {
          actionSequence.push( ...tileAction() );
        }
        ac.startActionSequence( actionSequence );
        break;
      case keys.right:
        p.dir = Direction.right;
        tileData = tileMap.checkTile( p.tilePos.x + 1, p.tilePos.y );
        walkable = tileData.walkable;
        tileAction = tileData.action;
        if ( walkable ) {
          p.tilePos.x++;
          p.isMoving = true;
        }

        actionSequence = [
          {
            frames: 8,
            action: () => {
              if ( p.isMoving ) tileMap.x--;
              p.frameIndex = p.dir;
              return true;
            },
          },
          {
            frames: 8,
            action: ( n: number ) => {
              if ( n === 8 ) {
                if ( !( p.isMoving || keys.right ) ) {
                  return false;
                }
              }
              if ( p.isMoving ) tileMap.x--;
              p.frameIndex = 9;
              if ( n === 1 ) {
                p.frameIndex = p.dir;
              }
            },
          },
        ];
        if ( tileAction ) {
          actionSequence.push( ...tileAction() );
        }
        ac.startActionSequence( actionSequence );
        break;
    }
    return;
  }
}
