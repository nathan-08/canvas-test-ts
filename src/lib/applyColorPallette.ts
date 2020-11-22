export function applyColorPallette( imgData: ImageData, debug=false ): void {
    const keyPixel = imgData.data[0];
    for ( let i = 0; i < imgData.data.length; i += 4 ) {
      if ( imgData.data[i] === keyPixel ) {
        imgData.data[i + 3] = 0; // set alpha to 0
      } else {
        switch ( imgData.data[i] ) {
          case 232:
            imgData.data[i+0] = 155;
            imgData.data[i+1] = 188;
            imgData.data[i+2] = 15;
            break;
          case 176:
          case 168:
            imgData.data[i+0] = 139;
            imgData.data[i+1] = 172;
            imgData.data[i+2] = 15;
            break;
          case 153:
          case 96:
            imgData.data[i+0] = 48;
            imgData.data[i+1] = 98;
            imgData.data[i+2] = 48;
            break;
          case 20:
          case 0:
            imgData.data[i+0] = 15;
            imgData.data[i+1] = 56;
            imgData.data[i+2] = 15;
            break;
        default:
            if ( debug )
                console.log(
                    imgData.data[i+0],
                    imgData.data[i+1],
                    imgData.data[i+2],
                );
        }
      }
    }
}