import {FieldState} from "../components/Field";
import {getInitialField} from "../helpers/adjusting_functions";
import {calculateSteps} from "../logic/logic_functions";
import {Direction} from "../helpers/enums";
import {FieldAction} from "./actions";
import {Figure} from "../models/figures/figure";
import {Empty} from "../models/figures/empty";
import {includes} from "../helpers/function_helpers";
import {Reducer} from "redux";

export const initialState: FieldState = {
    field: getInitialField('W', 'B'),
    pickedFigureCoords: {x: -1, y: -1},
    steps: []
}

const toSwap = (field: Figure[][], i1: number, j1: number, i2: number, j2: number) => {
    let temp: Figure = field[i1][j1]
    field[i1][j1] = field[i2][j2];
    field[i2][j2] = temp;
    return field;
}

const toBeat = (field: Figure[][], i1: number, j1: number, i2: number, j2: number) => {
    field[i1][j1] = field[i2][j2];
    field[i2][j2] = new Empty();
    return field;
}

export const rootReducer: Reducer<FieldState, FieldAction> = (state = initialState, action: FieldAction): FieldState => {
    let i, j
    switch (action.type) {
        case 'CHOOSE_FIGURE':
            i = action.payload.i
            j = action.payload.j
            let a = calculateSteps(state.field, i, j, Direction.UP)
            return {
                field: state.field,
                pickedFigureCoords: {x: i, y: j},
                steps: a
            }
        case 'MAKE_STEP':
            i = action.payload.i
            j = action.payload.j
            if (includes({x: i, y: j}, state.steps) && state.pickedFigureCoords) {
                const x = state.pickedFigureCoords.x
                const y = state.pickedFigureCoords.y
                if (!(state.field[i][j] instanceof Empty)) {
                    state.field = toBeat(state.field, i, j, x, y)
                } else {
                    state.field = toSwap(state.field, i, j, x, y)
                }
                return {
                    field: state.field,
                    steps: [],
                    pickedFigureCoords: {x: -1, y: -1}
                }
            }
            return state;
        default:
            return state
    }
}