import {Figure} from "./figure";
import {PlayerSide} from "../../helpers/enums";

export class Pawn implements Figure {
    side: PlayerSide
    signature: string;

    constructor(side: PlayerSide) {
        this.side = side;
        this.signature = side + 'P'
    }
}