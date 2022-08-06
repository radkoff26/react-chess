import {AnyAction} from "redux";
import {
    CHOOSE_FIGURE,
    LAST_LINE,
    MAKE_STEP,
    SURRENDER,
    TICK,
    TYPE_CHOOSE_FIGURE, TYPE_LAST_LINE,
    TYPE_MAKE_STEP, TYPE_SURRENDER,
    TYPE_TICK
} from "./types";
import {PlayerSide} from "../helpers/enums";
import {Figure} from "../models/figures/figure";

// Payload for CellAction
export interface CellPayload {
    i: number
    j: number
}

// Cell action for Redux
export interface CellAction extends AnyAction {
    type: TYPE_CHOOSE_FIGURE | TYPE_MAKE_STEP
    payload: CellPayload
}

// Payload for PlayerInfoAction
export interface PlayerInfoPayload {
    side: PlayerSide
}

// Player Info action for Redux
export interface PlayerInfoAction extends AnyAction {
    type: TYPE_TICK | TYPE_SURRENDER
    payload: PlayerInfoPayload
}

// Payload for CellAction
export interface ChoicePayload {
    playerSide: PlayerSide
    i: number
    j: number
    figure: Figure
}

// Cell action for Redux
export interface ChoiceAction extends AnyAction {
    type: TYPE_LAST_LINE
    payload: ChoicePayload
}

export type CommonAction = CellAction | PlayerInfoAction | ChoiceAction

// Functions that return actions by given parameters
export const chooseFigure = (i: number, j: number): CellAction => ({type: CHOOSE_FIGURE, payload: {i, j}})
export const makeStep = (i: number, j: number): CellAction => ({type: MAKE_STEP, payload: {i, j}})
export const tick = (side: PlayerSide): PlayerInfoAction => ({type: TICK, payload: {side}})
export const surrender = (side: PlayerSide): PlayerInfoAction => ({type: SURRENDER, payload: {side}})
export const lastLine = (payload: ChoicePayload): ChoiceAction => ({type: LAST_LINE, payload})