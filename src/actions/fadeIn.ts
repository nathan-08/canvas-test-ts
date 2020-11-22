import { IAnimation, IRenderFlags } from '../types';

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
        // to 48
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
            case 155:
            case 139:
              imgData2.data[i + 0] = 48;
              imgData2.data[i + 1] = 98;
              imgData2.data[i + 2] = 48;
              imgData2.data[i + 3] = 255;
              break;
            default:
              imgData2.data[i + 0] = imgData.data[i + 0];
              imgData2.data[i + 1] = imgData.data[i + 1];
              imgData2.data[i + 2] = imgData.data[i + 2];
              imgData2.data[i + 3] = imgData.data[i + 3];
          }
        }
        ctx.putImageData( imgData2, 0, 0 );
      }
      if ( n === 40 ) {
        // to 139
        for ( let i = 0; i < imgData.data.length; i += 4 ) {
          if ( imgData.data[i] === 155 ) {
            imgData2.data[i + 0] = 139;
            imgData2.data[i + 1] = 172;
            imgData2.data[i + 2] = 15;
          } else {
            imgData2.data[i + 0] = imgData.data[i + 0];
            imgData2.data[i + 1] = imgData.data[i + 1];
            imgData2.data[i + 2] = imgData.data[i + 2];
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
