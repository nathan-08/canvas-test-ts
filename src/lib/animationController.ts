import { IAnimation, IKeys } from '../types';

export class AnimationController {
  private frames = 0;
  private actions: IAnimation[] = [];

  public get ready(): boolean {
    return this.frames === 0;
  }
  public get pending(): boolean {
    return this.frames === -1;
  }

  public startActionSequence( actions: IAnimation[] ): void {
    if ( !this.ready ) throw new Error( 'Animation in progress' );
    this.actions = actions;
    this.frames = this.actions[0].frames;
  }

  public _step( keys: IKeys ): void {
    if ( this.frames === 0 ) return;
    if ( this.frames > 0 ) {
      if ( this.actions[0].action( this.frames-- ) === false ) {
        this.frames = 0;
      }
      if ( this.frames === 0 ) {
        this.actions.shift();
        if ( this.actions[0] ) {
          this.frames = this.actions[0].frames;
        }
      }
    }
    else if ( this.frames < 0 ) { // io blocking action
      if ( this.actions[0].action( undefined, keys ) ) {
        this.actions.shift();
        this.frames = 0;
        if ( this.actions[0] ) {
          this.frames = this.actions[0].frames;
        }
      }
    }
  }
}
