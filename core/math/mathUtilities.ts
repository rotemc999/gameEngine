namespace GE {
    export function degRad(angle: number): number {
        return angle * Math.PI / 180;
    }

    export function radDeg(angle: number): number {
        return angle * 180 / Math.PI;
    }
}