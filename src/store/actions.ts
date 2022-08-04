import {AnyAction} from "redux";
import {CHOOSE_FIGURE, MAKE_STEP} from "./types";

// Payload for FieldAction
export interface FieldPayload {
    i: number
    j: number
}

// Field action for Redux
export interface FieldAction extends AnyAction {
    payload: FieldPayload
}

// Functions that return actions by given parameters
export const chooseFigure = (i: number, j: number): FieldAction => ({type: CHOOSE_FIGURE, payload: {i, j}})
export const makeStep = (i: number, j: number): FieldAction => ({type: MAKE_STEP, payload: {i, j}})