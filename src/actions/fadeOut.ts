import { IAnimation, IRenderFlags } from '../types';

export function getFadeOutAction(
  ctx: CanvasRenderingContext2D,
  altCtx: CanvasRenderingContext2D,
  renderFlags: IRenderFlags,
): IAnimation {
  const imgData = ctx.getImageData( 0, 0, ctx.canvas.width, ctx.canvas.height );
  return {
    action: ( n: number ) => {
      if ( n === 60 ) {
        renderFlags.renderOverrideFlag = true; // disable normal renderer while animation is running
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case 155:
              imgData.data[i + 0] = 139;
              imgData.data[i + 1] = 172;
              imgData.data[i + 2] = 15;
              break;
            case 139:
              imgData.data[i + 0] = 48;
              imgData.data[i + 1] = 98;
              imgData.data[i + 2] = 48;
              break;
            case 48:
              imgData.data[i + 0] = 15;
              imgData.data[i + 1] = 56;
              imgData.data[i + 2] = 15;
              break;
          }
        }
        ctx.putImageData( imgData, 0, 0 );
      }
      if ( n === 40 ) {
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case 139:
              imgData.data[i + 0] = 48;
              imgData.data[i + 1] = 98;
              imgData.data[i + 2] = 48;
              break;
            case 48:
              imgData.data[i + 0] = 15;
              imgData.data[i + 1] = 56;
              imgData.data[i + 2] = 15;
              break;
          }
        }
        ctx.putImageData( imgData, 0, 0 );
      }
      if ( n === 20 ) {
        // all black
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case 48:
              imgData.data[i + 0] = 15;
              imgData.data[i + 1] = 56;
              imgData.data[i + 2] = 15;
              break;
          }
        }
        ctx.putImageData( imgData, 0, 0 );
      }
    },
    frames: 60,
    onComplete: () => null,
  };
}
