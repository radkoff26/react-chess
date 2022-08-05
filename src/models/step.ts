import {Coords} from "../logic/logic_functions";

export interface Step {
    from: Coords
    to: Coords
    wasBeating: boolean
}