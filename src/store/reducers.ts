import {FieldState} from "../components/Field";
import {getInitialField} from "../helpers/adjusting_functions";
import {calculateSteps, checkIfKingIsSafe, findDirection} from "../logic/logic_functions";
import {FieldAction} from "./actions";
import {Figure} from "../models/figures/figure";
import {Empty} from "../models/figures/empty";
import {includes} from "../helpers/function_helpers";
import {Reducer} from "redux";

// Initial state for Field Component
export const initialState: FieldState = {
    field: getInitialField('W', 'B'),
    pickedFigureCoords: {x: -1, y: -1},
    steps: [],
    player: 'W',
    isKingSafe: {W: true, B: true},
    isGameOver: false
}

// Function to switch (toggle) player (color of player in this case)
const togglePlayer = (player: string): string => (player === 'W' ? 'B' : 'W');

// Function that swaps figure of two cells of the field
// It's used for the process of making step by a figure
const toSwap = (field: Figure[][], i1: number, j1: number, i2: number, j2: number) => {
    let temp: Figure = field[i1][j1]
    field[i1][j1] = field[i2][j2];
    field[i2][j2] = temp;
    return field;
}

// Function that provides process of beating one figure by another one
const toBeat = (field: Figure[][], i1: number, j1: number, i2: number, j2: number) => {
    field[i1][j1] = field[i2][j2];
    field[i2][j2] = new Empty();
    return field;
}

// Root Reducer for Redux
export const rootReducer: Reducer<FieldState, FieldAction> = (state = initialState, action: FieldAction): FieldState => {
    // Variables for simplification
    let i, j
    // Processing of the action
    switch (action.type) {
        case 'CHOOSE_FIGURE':
            i = action.payload.i
            j = action.payload.j

            // When player picks the figure to step, this function will eventually return the same state
            // with "pickedFigureCoords" and "steps" changed
            // This will cause re-render that will apply all the changes - it will glow cells that are possible to step on
            return {
                field: state.field,
                pickedFigureCoords: {x: i, y: j},
                steps: calculateSteps(state.field, i, j, findDirection(state.player)),
                player: state.player,
                isKingSafe: state.isKingSafe,
                isGameOver: state.isGameOver
            }
        case 'MAKE_STEP':
            i = action.payload.i
            j = action.payload.j

            // When making step, it's necessary to check that coords of new cell are real to step on
            // and that figure is picked
            if (includes({x: i, y: j}, state.steps) && state.pickedFigureCoords) {
                // Simplification
                const x = state.pickedFigureCoords.x
                const y = state.pickedFigureCoords.y

                // If new cell is not empty and there is an enemy on it
                if (!(state.field[i][j] instanceof Empty)) {
                    // Then this enemy will be beaten by picked figure
                    state.field = toBeat(state.field, i, j, x, y)
                } else {
                    // Otherwise it means that new cell is empty
                    // and it will only take some swapping
                    state.field = toSwap(state.field, i, j, x, y)
                }

                // Make copies of some inner objects of the state
                let isKingSafe = JSON.parse(JSON.stringify(state.isKingSafe))
                let isGameOver = JSON.parse(JSON.stringify(state.isGameOver))

                // Toggle player
                const nextPlayer = togglePlayer(state.player)

                // Check if next player is under a shah or not
                if (nextPlayer === 'B') {
                    isKingSafe.B = checkIfKingIsSafe(state.field, nextPlayer)
                } else {
                    isKingSafe.W = checkIfKingIsSafe(state.field, nextPlayer)
                }

                // If current player stepped and they're still under a shah
                if (!checkIfKingIsSafe(state.field, state.player)) {
                    // Then it's a checkmate - game is over
                    isGameOver = true
                } else {
                    // Otherwise the threat is gone
                    if (state.player === 'B') {
                        isKingSafe.B = true
                    } else {
                        isKingSafe.W = true
                    }
                }

                // Return renewed state
                return {
                    field: state.field,
                    steps: [],
                    pickedFigureCoords: {x: -1, y: -1},
                    player: nextPlayer,
                    isKingSafe,
                    isGameOver
                }
            }
            // If making step is impossible, it returns the same state
            return state;
        default:
            // In other situations the same state will be returned
            return state
    }
}