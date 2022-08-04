import {Figure} from "./figure";

export class Pawn implements Figure {
    color: string;
    signature: string;

    constructor(color: string) {
        this.color = color;
        this.signature = color + 'P'
    }
}