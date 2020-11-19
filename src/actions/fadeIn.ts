import { IAnimation } from '../types';

export function getFadeInAnimation( ctx: CanvasRenderingContext2D ): IAnimation {
  return {
    action: ( frames: number ) => {
      if ( frames > 20 ) {
        ctx.filter = 'brightness( 33% )';
      } else if ( frames > 10 ) {
        ctx.filter = 'brightness( 66% )';
      } else {
        ctx.filter = 'brightness( 100% )';
      }
    },
    frames: 30,
  };
}
