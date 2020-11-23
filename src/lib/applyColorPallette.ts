import { colorscheme } from '../colorscheme';
const colors = colorscheme;

export function applyColorPallette( imgData: ImageData, player=false ): void {
    const keyPixel = imgData.data[0];
    for ( let i = 0; i < imgData.data.length; i += 4 ) {
      if ( imgData.data[i] === keyPixel ) {
        imgData.data[i + 3] = 0; // set alpha to 0
      } else {
        switch ( imgData.data[i] ) {
          case 232:
            imgData.data[i+0] = colors.lightest[0];
            imgData.data[i+1] = colors.lightest[1];
            imgData.data[i+2] = colors.lightest[2];
            break;
          case 176:
          case 168:
          case 153:
            imgData.data[i+0] = colors.light[0];
            imgData.data[i+1] = colors.light[1];
            imgData.data[i+2] = colors.light[2];
            break;
          case 96:
            imgData.data[i+0] = colors.dark[0];
            imgData.data[i+1] = colors.dark[1];
            imgData.data[i+2] = colors.dark[2];
            break;
          case 20:
          case 0:
            imgData.data[i+0] = colors.black[0];
            imgData.data[i+1] = colors.black[1];
            imgData.data[i+2] = colors.black[2];
            break;
        default:
            if ( false )
                console.log(
                    imgData.data[i+0],
                    imgData.data[i+1],
                    imgData.data[i+2],
                );
        }
      }
    }
}