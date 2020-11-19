import { IAnimation } from '../types';

export function getFadeOutAnimation( ctx: CanvasRenderingContext2D ): IAnimation {
  return {
    action: ( frames: number ) => {
      if ( frames > 20 ) {
        ctx.filter = 'brightness( 66% )';
      } else if ( frames > 10 ) {
        ctx.filter = 'brightness( 33% )';
      } else {
        ctx.filter = 'brightness( 0% )';
      }
    },
    frames: 30,
  };
}
