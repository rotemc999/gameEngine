export class Vector2 {
    #x;
    #y;
    #limit = 0;
    constructor(x, y) {
        if (typeof x === 'number') {
            this.#x = x;
        }
        else {
            console.error("the 'x' is not a number");
        }
        if (typeof y === 'number') {
            this.#y = y;
        }
        else {
            console.error("the 'y' is not a number");
        }
    }
    get x() {
        return this.#x;
    }
    set x(x) {
        if (typeof x === 'number') {
            this.#x = x;
        }
        else {
            console.error("the 'x' is not a number");
        }
    }
    get y() {
        return this.#y;
    }
    set y(y) {
        if (typeof y === 'number') {
            this.#y = y;
        }
        else {
            console.error("the 'y' is not a number");
        }
    }

    add(NewVector) {
        if (NewVector instanceof Vector2) {
            this.#x += NewVector.x;
            this.#y += NewVector.y;
            this.#checkLimit();
        }
        else {
            let objectType = NewVector.constructor.name;
            console.error('expected Vector2 type got ' + objectType, "TypeError");
        }
        return this;
    }
    sub(NewVector) {
        if (NewVector instanceof Vector2) {
            this.#x -= NewVector.x;
            this.#y -= NewVector.y;
            this.#checkLimit();
        }
        else {
            let objectType = NewVector.constructor.name;
            console.error('expected Vector2 type got ' + objectType, "TypeError");
        }
        return this;
    }

    multiply(number) {
        if (typeof number == 'number') {
            this.#x *= number;
            this.#y *= number;
            this.#checkLimit();
        }
        else {
            let objectType = number.constructor.name;
            console.error('expected Number type got ' + objectType, "TypeError");
        }
        return this;
    }
    divide(number) {
        if (typeof number == 'number') {
            this.#x /= number;
            this.#y /= number;
            this.#checkLimit();
        }
        else {
            let objectType = number.constructor.name;
            console.error('expected Number type got ' + objectType, "TypeError");
        }
        return this;

    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    setMag(number) {
        if (typeof number === 'number') {
            this.Normalize();
            this.Multiply(number);
            this.#checkLimit();
        }
        else {
            let objectType = number.constructor.name;
            console.error('expected Number type got ' + objectType, "TypeError");
        }
    }

    normalize() {
        let VectorLength = this.Mag();
        this.#x /= VectorLength;
        this.#y /= VectorLength;
        this.#checkLimit();

    }

    limit(number) {
        if (typeof number === 'number') {
            this.#limit = number;
        }
        else {
            let objectType = number.constructor.name;
            console.error('expected Number type got ' + objectType, "TypeError");
        }
    }
    #checkLimit() {
        if (this.#limit !== 0) {
            if (this.Mag() > this.#limit) {
                this.SetMag(this.#limit);
            }
        }
    }
    rotate(angle) {
        let rad = Math.PI / 180 * angle;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        this.#x = this.#x * cos - y * sin;
        this.#y = this.#x * sin + y * cos;
        return this;
    }
}