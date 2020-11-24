import { IAnimation, IRenderFlags } from '../types';
import { colorscheme } from '../colorscheme';

const { lightest, light, dark, black } = colorscheme;

export function getFadeOutAction(
  ctx: CanvasRenderingContext2D,
  altCtx: CanvasRenderingContext2D,
  renderFlags: IRenderFlags,
): IAnimation {
  let imgData: ImageData;
  return {
    frames: 30,
    action: ( n: number ) => {
      if ( n === 30 ) {
        imgData = ctx.getImageData( 0, 0, ctx.canvas.width, ctx.canvas.height );
        renderFlags.renderOverrideFlag = true; // disable normal renderer while animation is running
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case lightest[0]:
              imgData.data[i + 0] = light[0];
              imgData.data[i + 1] = light[1];
              imgData.data[i + 2] = light[2];
              break;
            case light[0]:
              imgData.data[i + 0] = dark[0];
              imgData.data[i + 1] = dark[1];
              imgData.data[i + 2] = dark[2];
              break;
            case dark[0]:
              imgData.data[i + 0] = black[0];
              imgData.data[i + 1] = black[1];
              imgData.data[i + 2] = black[2];
              break;
          }
        }
        ctx.putImageData( imgData, 0, 0 );
      }
      if ( n === 20 ) {
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case light[0]:
              imgData.data[i + 0] = dark[0];
              imgData.data[i + 1] = dark[1];
              imgData.data[i + 2] = dark[2];
              break;
            case dark[0]:
              imgData.data[i + 0] = black[0];
              imgData.data[i + 1] = black[1];
              imgData.data[i + 2] = black[2];
              break;
          }
        }
        ctx.putImageData( imgData, 0, 0 );
      }
      if ( n === 10 ) {
        // all black
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case dark[0]:
              imgData.data[i + 0] = black[0];
              imgData.data[i + 1] = black[1];
              imgData.data[i + 2] = black[2];
              break;
          }
        }
        ctx.putImageData( imgData, 0, 0 );
      }
      if ( n === 1 ) {
        renderFlags.renderOverrideFlag = false;
      }
      return true;
    },
  };
}
