import { IKeys } from '.';

export interface IAnimation {
    action: ( frames?: number, keys?: IKeys ) => boolean,
    frames: number,
    onComplete?: () => void,
}