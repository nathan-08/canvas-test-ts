import { createTextChangeRange } from "typescript";

interface ISmallTileData {
    smallTileId: number;
    animationSequence: number[];
    animationLength: number;
}

interface IMapTile {
    canWalk: boolean;
    tileId: number;
    detailData: {
        topLeft?: ISmallTileData,
        topRight?: ISmallTileData,
        bottomLeft?: ISmallTileData,
        bottomRight?: ISmallTileData,
    };
}

const mapTile: IMapTile = {
    canWalk: true,
    tileId: 0x0001,
    detailData: {},
};

// 0xF === 0b1111
const n = 0xff;

function genMapTile( n: number ): void {
    //
}

function getIterator( elements: number[] ) {
    let i = 0;
    return {
        next: () => {
            return elements[i];
            if( i < elements.length - 1 ) {
                i++;
            }
            else {
                i = 0;
            }
        }
    }
}

export const smallTileMatrix = [
    [ { id: 0, animationSequence: [ 0, 1, 2, 1 ] } ]
];

export const tileMatrix: IMapTile[][] = [
    [ { canWalk: true, tileId: 1, detailData: {} }, ],
];

const imgs: any[][] = [[]];
const ctx: any = {};

for( let i = 0; i < tileMatrix.length; i++ ) {
    for( let j = 0; j < tileMatrix[i].length; j++ ) {
        ctx.drawImage(
            imgs[tileMatrix[i][j].tileId],
            0,
            0,
            16,
            16,
            16*j, //offsetx
            16*i, //offsety
            16,
            16,
        )
    }
}

// check walkable
if( tileMatrix[0][0].canWalk ) {
    //
}

