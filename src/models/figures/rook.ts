import {Figure} from "./figure";
import {PlayerSide} from "../../helpers/enums";

export class Rook implements Figure {
    side: PlayerSide;
    signature: string;

    constructor(side: PlayerSide) {
        this.side = side;
        this.signature = side + 'R';
    }
}