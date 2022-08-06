import {GameState} from "../components/Field";
import {getInitialField} from "../helpers/adjusting_functions";
import {calculateSteps, checkIfKingIsSafe, findDirection} from "../logic/logic_functions";
import {CommonAction} from "./actions";
import {Figure} from "../models/figures/figure";
import {Empty} from "../models/figures/empty";
import {includes} from "../helpers/function_helpers";
import {Reducer} from "redux";
import {Step} from "../models/step";
import {CHOOSE_FIGURE, LAST_LINE, MAKE_STEP, SURRENDER, TICK} from "./types";
import {Pawn} from "../models/figures/pawn";
import {PlayerSide} from "../helpers/enums";

// Initial Game state
export const initialState: GameState = {
    field: getInitialField('W', 'B'),
    pickedFigureCoords: {x: -1, y: -1},
    steps: [],
    player: PlayerSide.W,
    isKingSafe: {W: true, B: true},
    isGameOver: false,
    playersInGame: {W: 'Player1', B: 'Player2'},
    winner: PlayerSide.NOTHING,
    timeLeftForW: 15 * 60,
    timeLeftForB: 15 * 60,
    madeStepsW: [],
    madeStepsB: [],
    lastLinePawnW: {f: false, i: -1, j: -1},
    lastLinePawnB: {f: false, i: -1, j: -1}
}

// Function to switch (toggle) player (color of player in this case)
const togglePlayer = (player: PlayerSide): PlayerSide => (player === PlayerSide.W ? PlayerSide.B : PlayerSide.W);

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
export const rootReducer: Reducer<GameState, CommonAction> = (state = initialState, action: CommonAction): GameState => {
    // Variables for simplification
    // Processing of the action
    switch (action.type) {
        case CHOOSE_FIGURE:
            // When player picks the figure to step, this function will eventually return the same state
            // with "pickedFigureCoords" and "steps" changed
            // This will cause re-render that will apply all the changes - it will glow cells that are possible to step on
            return {
                field: state.field,
                pickedFigureCoords: {x: action.payload.i, y: action.payload.j},
                steps: calculateSteps(state.field, action.payload.i, action.payload.j, findDirection(state.player)),
                player: state.player,
                isKingSafe: state.isKingSafe,
                isGameOver: state.isGameOver,
                playersInGame: state.playersInGame,
                winner: state.winner,
                timeLeftForW: state.timeLeftForW,
                timeLeftForB: state.timeLeftForB,
                madeStepsW: state.madeStepsW,
                madeStepsB: state.madeStepsB,
                lastLinePawnW: state.lastLinePawnW,
                lastLinePawnB: state.lastLinePawnB
            }
        case MAKE_STEP:
            const i = action.payload.i
            const j = action.payload.j

            // When making step, it's necessary to check that coords of new cell are real to step on
            // and that figure is picked
            if (includes({x: i, y: j}, state.steps) && state.pickedFigureCoords) {
                // Simplification
                const x = state.pickedFigureCoords.x
                const y = state.pickedFigureCoords.y

                let wasBeating

                // If new cell is not empty and there is an enemy on it
                if (!(state.field[i][j] instanceof Empty)) {
                    // Then this enemy will be beaten by picked figure
                    wasBeating = true
                    state.field = toBeat(state.field, i, j, x, y)
                } else {
                    // Otherwise it means that new cell is empty
                    // and it will only take some swapping
                    wasBeating = false
                    state.field = toSwap(state.field, i, j, x, y)
                }

                let step: Step = {from: {x, y}, to: {x: i, y: j}, wasBeating}
                let timeLeftForW = state.timeLeftForW
                let timeLeftForB = state.timeLeftForB

                if (state.player === PlayerSide.B) {
                    state.madeStepsB.push(step)
                    timeLeftForB += 10
                } else {
                    state.madeStepsW.push(step)
                    timeLeftForW += 10
                }

                // Make copies of some inner objects of the state
                let isKingSafe = JSON.parse(JSON.stringify(state.isKingSafe))
                let isGameOver = JSON.parse(JSON.stringify(state.isGameOver))

                let winner = PlayerSide.NOTHING

                // Toggle player
                const nextPlayer = togglePlayer(state.player)

                // Check if next player is under a shah or not
                if (nextPlayer === PlayerSide.B) {
                    isKingSafe.B = checkIfKingIsSafe(state.field, nextPlayer)
                } else {
                    isKingSafe.W = checkIfKingIsSafe(state.field, nextPlayer)
                }

                // If current player stepped and they're still under a shah
                if (!checkIfKingIsSafe(state.field, state.player)) {
                    // Then it's a checkmate - game is over
                    isGameOver = true
                    winner = nextPlayer
                } else {
                    // Otherwise the threat is gone
                    if (state.player === PlayerSide.B) {
                        isKingSafe.B = true
                    } else {
                        isKingSafe.W = true
                    }
                }

                let isLastLinePawnW = state.lastLinePawnW
                let isLastLinePawnB = state.lastLinePawnB

                if (state.field[i][j] instanceof Pawn && (i === 0 || i === 7)) {
                    if (state.player === PlayerSide.B) {
                        isLastLinePawnB = {f: true, i, j}
                    } else if (state.player === PlayerSide.W) {
                        isLastLinePawnW = {f: true, i, j}
                    }
                }

                // Return renewed state
                return {
                    field: state.field,
                    steps: [],
                    pickedFigureCoords: {x: -1, y: -1},
                    player: nextPlayer,
                    isKingSafe,
                    isGameOver,
                    playersInGame: state.playersInGame,
                    winner: winner,
                    timeLeftForW: timeLeftForW,
                    timeLeftForB: timeLeftForB,
                    madeStepsW: state.madeStepsW,
                    madeStepsB: state.madeStepsB,
                    lastLinePawnW: isLastLinePawnW,
                    lastLinePawnB: isLastLinePawnB
                }
            }
            // If making step is impossible, it returns the same state
            return state;
        case TICK:
            if (action.payload.side === PlayerSide.W) {
                if (state.timeLeftForW <= 0) {
                    return {...state, timeLeftForW: 0, isGameOver: true, winner: PlayerSide.B}
                }
                return {...state, timeLeftForW: state.timeLeftForW - 1}
            } else if (action.payload.side === PlayerSide.B) {
                if (state.timeLeftForB <= 0) {
                    return {...state, timeLeftForB: 0, isGameOver: true, winner: PlayerSide.W}
                }
                return {...state, timeLeftForB: state.timeLeftForB - 1}
            }
            return state;
        case SURRENDER:
            if (action.payload.side === PlayerSide.W) {
                return {...state, isGameOver: true, winner: PlayerSide.B}
            } else if (action.payload.side === PlayerSide.B) {
                return {...state, isGameOver: true, winner: PlayerSide.W}
            }
            return state
        case LAST_LINE:
            state.field[action.payload.i][action.payload.j] = action.payload.figure
            state.lastLinePawnW = {f: false, i: -1, j: -1}
            state.lastLinePawnB = {f: false, i: -1, j: -1}
            return {...state}
        default:
            // In other situations the same state will be returned
            return state
    }
}

// export const playerInfoReducer: Reducer<GameState, PlayerInfoAction> = (state = initialState, action: PlayerInfoAction): GameState => {
//     switch (action.type) {
//         default:
//             return state
//     }
// }

// export const choiceReducer: Reducer<GameState, ChoiceAction> = (state = initialState, action: ChoiceAction): GameState => {
//     switch (action.type) {
//     }
// }