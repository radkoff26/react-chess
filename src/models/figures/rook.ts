import {Figure} from "./figure";
import {PlayerSide} from "../../helpers/enums";
import {HasStep} from "./has_step";

export class Rook extends HasStep implements Figure {
    side: PlayerSide;
    signature: string;

    constructor(side: PlayerSide) {
        super(false)
        this.side = side;
        this.signature = side + 'R';
    }
}