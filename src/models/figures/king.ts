import {Figure} from "./figure";

export class King implements Figure {
    color: string;
    signature: string;

    constructor(color: string) {
        this.color = color;
        this.signature = color + 'K';
    }
}