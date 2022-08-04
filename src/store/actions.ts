import {AnyAction} from "redux";

export interface FieldPayload {
    i: number
    j: number
}

export interface FieldAction extends AnyAction {
    payload: FieldPayload
}

export const CHOOSE_FIGURE = (i: number, j: number): FieldAction => ({type: 'CHOOSE_FIGURE', payload: {i, j}})
export const MAKE_STEP = (i: number, j: number): FieldAction => ({type: 'MAKE_STEP', payload: {i, j}})