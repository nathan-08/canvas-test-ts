import { Point } from '../lib';

export const houseTileHash: { [index: number]: Point } = {
    0: new Point( 8 * 1, 0 ),
    1: new Point( 0, 0 ),
    2: new Point( 8 * 4, 0 ), // doormat 
    3: new Point( 8 * 4, 8 ), // doormat 
    4: new Point( 8 * 6, 0 ), // tv
    5: new Point( 8 * 7, 0 ), // tv
    6: new Point( 8 * 6, 8 ), // tv
    7: new Point( 8 * 7, 8 ), // tv
    8: new Point( 8 * 14, 0 ), // snes
    9: new Point( 8 * 15, 0 ), // snes
    10: new Point( 8 * 14, 8 ), // snes
    11: new Point( 8 * 15, 8 ), // snes
    12: new Point( 8*4, 8*2 ), // window
    13: new Point( 8*5, 8*2 ), // window
    14: new Point( 8*4, 8*3 ), // window
    15: new Point( 8*5, 8*3 ), // window
    16: new Point( 8*8, 8*1 ), // plant base
    17: new Point( 8*9, 8*1 ), // plant base
    18: new Point( 8*6, 8*4 ), // plant base
    19: new Point( 8*7, 8*4 ), // plant base
    20: new Point( 8*8, 8*0 ), // plant 
    21: new Point( 8*9, 8*0 ), // plant 
    22: new Point( 8*4, 8*4 ), // plant 
    23: new Point( 8*5, 8*4 ), // plant 
    24: new Point( 8*13, 8*2 ), // bed top
    25: new Point( 8*14, 8*2 ), // bed top
    26: new Point( 8*13, 8*3 ), // bed mid
    27: new Point( 8*14, 8*3 ), // bed mid
    28: new Point( 8*15, 8*3 ), // bed bottom
    29: new Point( 8*15, 8*2 ), // bed bottom
    30: new Point( 8*6, 8*2 ), // bookshelf top left
    31: new Point( 8*9, 8*2 ), // bookshelf top right
    32: new Point( 8*0, 8*3 ), // bookshelf
    33: new Point( 8*1, 8*3 ), // bookshelf
    34: new Point( 8*2, 8*2 ), // bookshelf
    35: new Point( 8*3, 8*2 ), // bookshelf
    36: new Point( 8*2, 8*3 ), // bookshelf
    37: new Point( 8*3, 8*3 ), // bookshelf
  };