interface IKeys {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    a: boolean;
    s: boolean;
}
export class IOController {

  private keys: IKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    s: false,
  };

  public getKeys(): IKeys { return this.keys }

  constructor() {
    document.addEventListener( 'keydown', this.handleKeyDown.bind( this ) );
    document.addEventListener( 'keyup', this.handleKeyUp.bind( this ) );
  }

  private handleKeyDown( e: KeyboardEvent ): void {
    switch( e.key ) {
      case 'ArrowUp': this.keys.up       = true; break;
      case 'ArrowDown': this.keys.down   = true; break;
      case 'ArrowLeft': this.keys.left   = true; break;
      case 'ArrowRight': this.keys.right = true; break;

      case 'a': this.keys.a = true; break;
      case 's': this.keys.s = true; break;
    }
  }

  private handleKeyUp( e: KeyboardEvent ): void {
    switch( e.key ) {
      case 'ArrowUp': this.keys.up       = false; break;
      case 'ArrowDown': this.keys.down   = false; break;
      case 'ArrowLeft': this.keys.left   = false; break;
      case 'ArrowRight': this.keys.right = false; break;

      case 'a': this.keys.a = false; break;
      case 's': this.keys.s = false; break;
    }
  }
}
