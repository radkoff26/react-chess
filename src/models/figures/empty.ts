import {Figure} from "./figure";
import {PlayerSide} from "../../helpers/enums";

export class Empty implements Figure {
    side: PlayerSide = PlayerSide.NOTHING;
    signature: string = "";
}