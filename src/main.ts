window.onload = main;

async function main(): Promise<void> {
  const canvas = document.createElement( 'canvas' );
  canvas.setAttribute( 'width', '128' );
  canvas.setAttribute( 'height', '128' );
  canvas.setAttribute(
    'style',
    'border: 0px solid #eee; image-rendering: pixelated; height: 512px; width: 512px;',
  );
  document.body.appendChild( canvas );
  const ctx = canvas.getContext( '2d' );

  const altCanvas = document.createElement( 'canvas' );
  altCanvas.setAttribute( 'width', '256' );
  altCanvas.setAttribute( 'height', '128' );
  altCanvas.setAttribute(
    'style',
    'border: 1px solid #eee; image-rendering: pixelated; height: 512px; width: 1024px;',
  );
  //document.body.appendChild( altCanvas );
  const altCtx = altCanvas.getContext( '2d' );

  const fontImg = new ImageAsset( 'assets/nesfont.bmp' );
  const mapImg = new ImageAsset( 'assets/map1.png' );
  const spriteImg = new ImageAsset( 'assets/pokemon.png' );
  await Promise.all( [fontImg.wait(), mapImg.wait(), spriteImg.wait()] );

  const roomRect = new Rect( 8 * 17, 8 * 37 - 2, 8 * 20, 8 * 20 );
  function drawMap() {
    ctx.drawImage(
        mapImg.img,
        roomRect.x,
        roomRect.y,
        roomRect.w,
        roomRect.h,
        0,
        0,
        roomRect.w,
        roomRect.h,
    );
  }

  function drawSprite(
    ctx: CanvasRenderingContext2D,
    src: HTMLImageElement,
    rect: Rect,
    dx: number,
    dy: number,
  ) {
    ctx.drawImage( src, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w, rect.h );
  }
  const walkingSprites: Rect[] = [
    new Rect( 16 * 0 + 9,  16 * 8.5, 16, 16 ),
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
  const promises = [];
  for ( let i = 0; i < 10; i++ ) {
    drawSprite( altCtx, spriteImg.img, walkingSprites[i], 16 * i, 0 );
    const s = altCtx.getImageData( 16*i, 0, 16, 16 );
    const x = s.data[0];
    for( let i = 0; i < s.data.length; i += 4 ) {
        if( s.data[i] === x ) {
            s.data[i+3] = 0;
        }
    }
    promises.push( imgdata_to_image( s ) );
  }
  const walkingImgs = await Promise.all( promises );

  const p = new Player( 16*3, 16*7 );
  const keys = {
      up: false, down: false, left: false, right: false,
  };
  document.addEventListener( 'keydown', ( event ) => {
    event.preventDefault();
    switch( event.key ) {
        case 'ArrowUp':    keys.up    = true; break;
        case 'ArrowDown':  keys.down  = true; break;
        case 'ArrowLeft':  keys.left  = true; break;
        case 'ArrowRight': keys.right = true; break;
    }
  } );
  document.addEventListener( 'keyup', ( event ) => {
    event.preventDefault();
    switch( event.key ) {
        case 'ArrowUp':    keys.up    = false; break;
        case 'ArrowDown':  keys.down  = false; break;
        case 'ArrowLeft':  keys.left  = false; break;
        case 'ArrowRight': keys.right = false; break;
    }
  } );
  let frame = 0;
  let counter = 0;
  const objRects: Rect[] = getObjRects();
  function gameLoop() {
    p.isMoving = false;
    if( keys.up    ) { p.y --; p.dir = Direction.up;    p.isMoving = true; }
    if( keys.down  ) { p.y ++; p.dir = Direction.down;  p.isMoving = true; }
    if( keys.left  ) { p.x --; p.dir = Direction.left;  p.isMoving = true; }
    if( keys.right ) { p.x ++; p.dir = Direction.right; p.isMoving = true; }
    if( p.isMoving && checkForCollision( p ) ) {
        if( keys.up    ) { p.y ++; }
        if( keys.down  ) { p.y --; }
        if( keys.left  ) { p.x ++; }
        if( keys.right ) { p.x --; }
    }
    drawMap();
    if( frame % 14 === 0 ) {
        counter ++;
    }
    let frameIndex = p.dir;
    if( p.isMoving ) {
        if( p.dir === Direction.up || p.dir === Direction.down ) {
            frameIndex = counter%2==0 ? p.dir-1 : p.dir+1;
        }
        else {
            frameIndex = counter%2==0 ? p.dir+1 : p.dir;
        }
    }
    
    ctx.drawImage( walkingImgs[frameIndex], p.x, p.y );
    frame++;
    requestAnimationFrame( gameLoop );
  }
  gameLoop();

  function checkForCollision( p: Player ): boolean {
    if( p.y < 0 ) p.y = 0;
    if( p.y > canvas.height - 16 ) p.y = canvas.height - 16;
    if( p.x < 0 ) p.x = 0;
    if( p.x > canvas.width - 16 ) p.x = canvas.width - 16; 
    return objRects.some( ( obj ) => checkCollision( obj, p ) );
  }
  function checkCollision( obj: Rect, p: Player ) {
    const leftA = obj.x;
    const rightA = obj.x + obj.w;
    const topA = obj.y;
    const bottomA = obj.y + obj.h;

    const leftB = p.x;
    const rightB = p.x + 16;
    const topB = p.y;
    const bottomB = p.y + 16;

    if( bottomA <= topB ) return false;
    if( topA >= bottomB ) return false;
    if( rightA <= leftB ) return false;
    if( leftA >= rightB ) return false;
    return true;
  }
}

enum Direction { up = 4, down = 1, left = 6, right = 8 };
class Player {
    velX = 0; velY = 0; dir: Direction = Direction.down; isMoving = false;
    constructor( public x: number, public y: number ) {}
}

function getObjRects(): Rect[] {
    return [
        new Rect( 0, 0, 16*2, 16*1.5 ),         // top left books
        new Rect( 16*3, 16*3, 16*2, 16*1.5 ), // table
        new Rect( 0, 16*6, 16, 16*2 ),        // bottom left plant
        new Rect( 16*7, 16*6, 16, 16*2 ),     // bottom right plant
        new Rect( 0, 0, 16*7, 8 ),           // top wall
        new Rect( 16*7, 0, 16, 16*1.5 ),        // top right books
    ];
}
async function imgdata_to_image( imageData: ImageData ): Promise<HTMLImageElement> {
    const canvas = document.createElement( 'canvas' );
    const ctx = canvas.getContext( '2d' );
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData( imageData, 0, 0 );
    const img = new Image();
    img.src = canvas.toDataURL();
    await new Promise( ( resolve ) => img.addEventListener( 'load', resolve ) );
    return img;
}

class ImageAsset {
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

class Rect {
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
  ) {}
}
