export class ImageAsset {
  public readonly img;
  constructor( path: string ) {
    this.img = new Image();
    this.img.src = path;
  }
  public async wait(): Promise<void> {
    if ( this.img.complete ) {
      return Promise.resolve();
    } else
      return new Promise( ( resolve ) => {
        this.img.addEventListener( 'load', () => resolve() );
      } );
  }
}