namespace GE {
    export function degRad(angle: number): number {
        return angle * Math.PI / 180;
    }

    export function radDeg(angle: number): number {
        return angle * 180 / Math.PI;
    }

    export function distance(position1: Vector2, position2: Vector2):number{
        return position1.mag() - position2.mag();       
    }
}