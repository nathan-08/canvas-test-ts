export class AnimationController {
  private frames = 0;
  private animation: Animation;

  public get ready(): boolean {
    return this.frames === 0;
  }

  public initiate( a: Animation ): void {
    this.frames = a.frames;
    this.animation = a;
  }

  public step(): void {
    if( this.frames === 0 ) return;
    this.animation.action( this.frames );
    this.frames--;
    if( this.frames === 0 && this.animation.onComplete ) {
        this.animation.onComplete();
    }
  }
}

export class Animation {
  constructor(
      public action: ( frames: number ) => void,
      public frames: number,
      public onComplete?: () => void,
  ) {}
}
