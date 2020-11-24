import { applyColorPallette, formatText } from '.';
import { IAnimation, IKeys, ITextPage } from '../types';

export class OutputController {
  public showDialog = false;
  private line1 = '';
  private line2 = '';
  private showDownArrow = false;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  constructor( private src: HTMLImageElement ) {
    this.canvas = document.createElement( 'canvas' );
    this.ctx = this.canvas.getContext( '2d' );
    this.canvas.width = this.src.width;
    this.canvas.height = this.src.height;
    this.canvas.setAttribute(
      'style',
      `image-rendering: pixelated; width: ${this.src.width * 4}px; height: ${
        this.src.height * 4
      }px; background: white;`,
    );
    // document.body.appendChild( this.canvas );
    this.ctx.drawImage( this.src, 0, 0 );
    const imgData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height,
    );
    applyColorPallette( imgData );
    this.ctx.putImageData( imgData, 0, 0 );
  }
  public createTextActionSequence( msg: string ): IAnimation[] {
    const pages = formatText( msg );
    const actions: IAnimation[] = [
      {
        frames: 1,
        action: () => {
          this.line1 = '';
          this.line2 = '';
          this.showDownArrow = false;
          return true;
        },
      },
      {
        frames: 1,
        action: () => {
          this.showDialog = true;
          return true;
        },
      },
    ];
    for ( let i = 0; i < pages.length; i++ ) {
      for ( let j = 0; j < pages[i].line1.length; j++ ) {
        const animation = {
          frames: 3,
          action: ( n: number ) => {
            if ( n === 3 ) {
              this.line1 += pages[i].line1[j];
            }
            return true;
          },
        };
        actions.push( animation );
      }
      for ( let j = 0; j < pages[i].line2.length; j++ ) {
        const animation = {
          frames: 3,
          action: ( n: number ) => {
            if ( n === 3 ) {
              this.line2 += pages[i].line2[j];
              if ( i < pages.length - 1 && j === pages[i].line2.length - 1 ) {
                this.showDownArrow = true;
                return false;
              }
            }
            return true;
          },
        };
        actions.push( animation );
      }
      actions.push( {
        frames: -1,
        action: ( _: number, keys: IKeys ) => keys.a,
      } );
      actions.push( {
        frames: 1,
        action: () => {
          this.showDownArrow = false;
          this.line1 = '';
          this.line2 = '';
          return true;
        }
      } );
    }
    actions.push( {
      frames: 8,
      action: ( n: number ) => {
        if ( n === 8 ) {
          this.showDialog = false;
        }
        return true;
      }
    } );

    return actions;
  }
  public testRender( ctx: CanvasRenderingContext2D ): void {
    if ( !this.showDialog ) return;
    this.drawBox( ctx );
    this.renderText( ctx, this.line1, this.line2 );
    if ( this.showDownArrow )
      this.renderDownArrow( ctx );
  }
  private renderText(
    ctx: CanvasRenderingContext2D,
    line1: string,
    line2?: string,
  ) {
    this.renderLine( ctx, line1, 8, ctx.canvas.height - 8 * 4.5 );
    if ( line2 ) this.renderLine( ctx, line2, 8, ctx.canvas.height - 8 * 2.5 );
  }
  private renderLine(
    ctx: CanvasRenderingContext2D,
    msg: string,
    startx: number,
    starty: number,
  ) {
    for ( let i = 0; i < msg.length; i++ ) {
      if ( msg[i] >= 'a' && msg[i] <= 'z' ) {
        ctx.drawImage(
          this.canvas,
          8 * ( msg[i].charCodeAt( 0 ) - 97 ),
          8 * 1,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] >= 'A' && msg[i] <= 'Z' ) {
        ctx.drawImage(
          this.canvas,
          8 * ( msg[i].charCodeAt( 0 ) - 65 ),
          0,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] >= '0' && msg[i] <= '9' ) {
        ctx.drawImage(
          this.canvas,
          8 * ( msg[i].charCodeAt( 0 ) - 48 ),
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === '(' ) {
        ctx.drawImage(
          this.canvas,
          8 * 13,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === ')' ) {
        ctx.drawImage(
          this.canvas,
          8 * 14,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === ':' ) {
        ctx.drawImage(
          this.canvas,
          8 * 15,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === ';' ) {
        ctx.drawImage(
          this.canvas,
          8 * 16,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === '[' ) {
        ctx.drawImage(
          this.canvas,
          8 * 17,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === ']' ) {
        ctx.drawImage(
          this.canvas,
          8 * 18,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === '?' ) {
        ctx.drawImage(
          this.canvas,
          8 * 19,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === '!' ) {
        ctx.drawImage(
          this.canvas,
          8 * 20,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === '.' ) {
        ctx.drawImage(
          this.canvas,
          8 * 21,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === ',' ) {
        ctx.drawImage(
          this.canvas,
          8 * 22,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === '/' ) {
        ctx.drawImage(
          this.canvas,
          8 * 23,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
      else if ( msg[i] === "'" ) {
        ctx.drawImage(
          this.canvas,
          8 * 24,
          8 * 2,
          8,
          8,
          startx + 8 * i,
          starty,
          8,
          8,
        );
      }
    }
  }
  private renderDownArrow( ctx: CanvasRenderingContext2D ) {
    ctx.drawImage(
      this.canvas,
      8 * 12,
      8 * 2,
      8,
      8,
      ctx.canvas.width - 8 * 2,
      ctx.canvas.height - 8 * 2,
      8,
      8,
    );
  }
  private drawBox( ctx: CanvasRenderingContext2D ): void {
    ctx.fillRect( 0, ctx.canvas.height - 8 * 6, ctx.canvas.width, 8 * 6 );
    // draw border
    ctx.drawImage(
      // top left
      this.canvas,
      0,
      8 * 3,
      8,
      8,
      0,
      ctx.canvas.height - 8 * 6,
      8,
      8,
    );
    ctx.drawImage(
      // bottom left
      this.canvas,
      0,
      8 * 5,
      8,
      8,
      0,
      ctx.canvas.height - 8,
      8,
      8,
    );
    ctx.drawImage(
      // top right
      this.canvas,
      8 * 2,
      8 * 3,
      8,
      8,
      ctx.canvas.width - 8,
      ctx.canvas.height - 8 * 6,
      8,
      8,
    );
    ctx.drawImage(
      // bottom right
      this.canvas,
      8 * 2,
      8 * 5,
      8,
      8,
      ctx.canvas.width - 8,
      ctx.canvas.height - 8,
      8,
      8,
    );
    for ( let i = 0; i < 18; i++ ) {
      // draw top horiz. bar
      ctx.drawImage(
        this.canvas,
        8,
        8 * 3,
        8,
        8,
        8 + 8 * i,
        ctx.canvas.height - 8 * 6,
        8,
        8,
      );
    }
    for ( let i = 0; i < 18; i++ ) {
      // draw bottom horiz. bar
      ctx.drawImage(
        this.canvas,
        8,
        8 * 3,
        8,
        8,
        8 + 8 * i,
        ctx.canvas.height - 8,
        8,
        8,
      );
    }
    for ( let i = 0; i < 4; i++ ) {
      // draw left vert. bar
      ctx.drawImage(
        this.canvas,
        0,
        8 * 4,
        8,
        8,
        0,
        ctx.canvas.height - 8 * ( i + 2 ),
        8,
        8,
      );
    }
    for ( let i = 0; i < 4; i++ ) {
      // draw right vert. bar
      ctx.drawImage(
        this.canvas,
        0,
        8 * 4,
        8,
        8,
        ctx.canvas.width - 8,
        ctx.canvas.height - 8 * ( i + 2 ),
        8,
        8,
      );
    }
  }
}
