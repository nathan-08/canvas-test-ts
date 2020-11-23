import { IAnimation, IRenderFlags } from '../types';
import { colorscheme } from '../colorscheme';

const { lightest, light, dark, black } = colorscheme;

export function getFadeInAction(
  ctx: CanvasRenderingContext2D,
  altCtx: CanvasRenderingContext2D,
  renderFlags: IRenderFlags,
): IAnimation {
  let imgData: ImageData;
  let imgData2: ImageData;
  return {
    action: ( n: number ) => {
      if ( n === 61 ) {
        renderFlags.altCanvas = true;
        renderFlags.renderOverrideFlag = false;
      }
      if ( n === 60 ) {
        renderFlags.renderOverrideFlag = true;
        imgData = altCtx.getImageData(
          0,
          0,
          ctx.canvas.width,
          ctx.canvas.height,
        );
        imgData2 = ctx.createImageData( imgData );
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case lightest[0]:
              imgData2.data[i + 0] = dark[0];
              imgData2.data[i + 1] = dark[1];
              imgData2.data[i + 2] = dark[2];
              imgData2.data[i + 3] = 255;
              break;
            default:
              imgData2.data[i + 0] = black[0];
              imgData2.data[i + 1] = black[1];
              imgData2.data[i + 2] = black[2];
              imgData2.data[i + 3] = imgData.data[i + 3];
          }
        }
        ctx.putImageData( imgData2, 0, 0 );
      }
      if ( n === 40 ) {
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          switch ( imgData.data[i] ) {
            case lightest[0]:
              imgData2.data[i + 0] = light[0];
              imgData2.data[i + 1] = light[1];
              imgData2.data[i + 2] = light[2];
              imgData2.data[i + 3] = 255;
              break;
            case light[0]:
              imgData2.data[i + 0] = dark[0];
              imgData2.data[i + 1] = dark[1];
              imgData2.data[i + 2] = dark[2];
              imgData2.data[i + 3] = 255;
              break;
            default:
              imgData2.data[i + 0] = black[0];
              imgData2.data[i + 1] = black[1];
              imgData2.data[i + 2] = black[2];
              imgData2.data[i + 3] = imgData.data[i + 3];

          }
        }
        ctx.putImageData( imgData2, 0, 0 );
      }
      if ( n === 20 ) {
        // back to full color
        renderFlags.renderOverrideFlag = false;
        renderFlags.altCanvas = false;
      }
    },
    frames: 61,
    onComplete: () => null,
  };
}
