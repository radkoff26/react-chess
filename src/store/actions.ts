import {AnyAction} from "redux";
import {CHOOSE_FIGURE, MAKE_STEP, TICK} from "./types";

// Payload for FieldAction
export interface FieldPayload {
    i: number
    j: number
    side: string
}

// Payload for PlayerInfoAction
export interface PlayerInfoPayload {
    side: string
}

// Field action for Redux
export interface FieldAction extends AnyAction {
    payload: FieldPayload
}

// Player Info action for Redux
export interface PlayerInfoAction extends AnyAction {
    payload: PlayerInfoPayload
}

// Functions that return actions by given parameters
export const chooseFigure = (i: number, j: number): FieldAction => ({type: CHOOSE_FIGURE, payload: {i, j, side: ''}})
export const makeStep = (i: number, j: number): FieldAction => ({type: MAKE_STEP, payload: {i, j, side: ''}})
export const tick = (side: string): FieldAction => ({type: TICK, payload: {side, i: -1, j: -1}})