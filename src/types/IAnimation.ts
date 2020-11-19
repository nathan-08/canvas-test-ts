export interface IAnimation {
    action: ( frames?: number ) => void,
    frames: number,
    onComplete?: () => void,
}