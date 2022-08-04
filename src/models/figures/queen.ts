import {Figure} from "./figure";

export class Queen implements Figure {
    color: string;
    signature: string;

    constructor(color: string) {
        this.color = color;
        this.signature = color + 'Q'
    }
}