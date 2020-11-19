import { IAnimation } from '../types';

export class AnimationController {
  private frames = 0;
  private action: ( frames?: number ) => void;
  private onComplete: () => void;

  public get ready(): boolean {
    return this.frames === 0;
  }

  public startAnimation( { action, frames, onComplete }: IAnimation ): void {
    if( !this.ready ) throw new Error( 'Animation in progress' );
    this.action = action;
    this.frames = frames;
    this.onComplete = onComplete;
  }

  public step(): void {
    if( this.frames === 0 ) return;
    this.action( this.frames-- );
    if( this.frames === 0 && this.onComplete ) {
        this.onComplete();
    }
  }
}
