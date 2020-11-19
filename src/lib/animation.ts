export class AnimationController {
  private frames = 0;
  private action: ( frames?: number ) => void;
  private onComplete: () => void;

  public get ready(): boolean {
    return this.frames === 0;
  }

  public initiate( { action, frames, onComplete }: IAnimation ): void {
    this.action = action;
    this.frames = frames;
    this.onComplete = onComplete;
  }

  public step(): void {
    if( this.frames === 0 ) return;
    this.action( this.frames );
    this.frames--;
    if( this.frames === 0 ) {
        if( this.onComplete ) {
            this.onComplete();
        }
    }
  }
}

interface IAnimation {
    action: ( frames?: number ) => void,
    frames: number,
    onComplete?: () => void,
}
