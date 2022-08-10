import {GameState} from "../components/Field";
import {getInitialField} from "../helpers/adjusting_functions";
import {calculateSteps, checkIfKingIsSafe, Coords, findDirection} from "../logic/logic_functions";
import {CommonAction} from "./actions";
import {Figure} from "../models/figures/figure";
import {Empty} from "../models/figures/empty";
import {copyArray, copyDoubleArray, includes} from "../helpers/function_helpers";
import {Reducer} from "redux";
import {Step} from "../models/step";
import {CHOOSE_FIGURE, GAME_ADJUSTMENT, LAST_LINE, MAKE_STEP, SURRENDER, TICK} from "./types";
import {Pawn} from "../models/figures/pawn";
import {PlayerSide} from "../helpers/enums";
import {Rook} from "../models/figures/rook";
import {King} from "../models/figures/king";
import {HasStep} from "../models/figures/has_step";

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
        case GAME_ADJUSTMENT:
            return {
                ...state,
                playersInGame: {
                    W: action.payload.player1,
                    B: action.payload.player2
                },
                timeLeftForW: action.payload.time * 60,
                timeLeftForB: action.payload.time * 60
            }
        case CHOOSE_FIGURE:
            // When player picks the figure to step, this function will eventually return the same state
            // with "pickedFigureCoords" and "steps" changed
            // This will cause re-render that will apply all the changes - it will glow cells that are possible to step on
            return {
                field: state.field,
                pickedFigureCoords: {x: action.payload.i, y: action.payload.j},
                steps: calculateSteps(state.field, action.payload.i, action.payload.j, findDirection(state.player)) as Coords[],
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

                let mutatedField: Figure[][] = copyDoubleArray<Figure>(state.field)

                if (mutatedField[x][y] instanceof HasStep) {
                    (mutatedField[x][y] as unknown as HasStep).hasStepped = true;
                }

                // If new cell is not empty and there is an enemy on it
                if (!(mutatedField[i][j] instanceof Empty)) {
                    // And colors are the same (the same side) - castling is possible
                    if (mutatedField[i][j].side === mutatedField[x][y].side) {
                        if (mutatedField[i][j] instanceof Rook && mutatedField[x][y] instanceof King) {
                            (mutatedField[i][j] as unknown as HasStep).hasStepped = true;
                            if (y < j) {
                                toSwap(mutatedField, x, y, x, y + 2)
                                toSwap(mutatedField, i, j, i, y + 1)
                            } else {
                                toSwap(mutatedField, x, y, x, y - 2)
                                toSwap(mutatedField, i, j, i, y - 1)
                            }
                        }
                        wasBeating = false
                    } else {
                        // Otherwise, this enemy will be beaten by picked figure
                        wasBeating = true
                        mutatedField = toBeat(mutatedField, i, j, x, y)
                    }
                } else {
                    // Otherwise it means that new cell is empty
                    // and it will only take some swapping
                    wasBeating = false
                    mutatedField = toSwap(mutatedField, i, j, x, y)
                }

                let step: Step = {from: {x, y}, to: {x: i, y: j}, wasBeating}
                let timeLeftForW = state.timeLeftForW
                let timeLeftForB = state.timeLeftForB

                let madeStepsBMutated = copyArray<Step>(state.madeStepsB)
                let madeStepsWMutated = copyArray<Step>(state.madeStepsW)

                if (state.player === PlayerSide.B) {
                    madeStepsBMutated.push(step)
                    timeLeftForB += 10
                } else {
                    madeStepsWMutated.push(step)
                    timeLeftForW += 10
                }

                // Make copies of some inner objects of the state
                let isKingSafe: { W: boolean, B: boolean } = JSON.parse(JSON.stringify(state.isKingSafe))
                let isGameOver = state.isGameOver

                let winner = PlayerSide.NOTHING

                // Toggle player
                const nextPlayer = togglePlayer(state.player)

                // Check if next player is under a shah or not
                if (nextPlayer === PlayerSide.B) {
                    isKingSafe.B = checkIfKingIsSafe(mutatedField, nextPlayer)
                } else {
                    isKingSafe.W = checkIfKingIsSafe(mutatedField, nextPlayer)
                }

                // If current player stepped and they're still under a shah
                if (!checkIfKingIsSafe(mutatedField, state.player)) {
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

                if (mutatedField[i][j] instanceof Pawn && (i === 0 || i === 7)) {
                    if (state.player === PlayerSide.B) {
                        isLastLinePawnB = {f: true, i, j}
                    } else if (state.player === PlayerSide.W) {
                        isLastLinePawnW = {f: true, i, j}
                    }
                }

                // Return renewed state
                return {
                    field: mutatedField,
                    steps: [],
                    pickedFigureCoords: {x: -1, y: -1},
                    player: nextPlayer,
                    isKingSafe,
                    isGameOver,
                    playersInGame: state.playersInGame,
                    winner: winner,
                    timeLeftForW: timeLeftForW,
                    timeLeftForB: timeLeftForB,
                    madeStepsW: madeStepsWMutated,
                    madeStepsB: madeStepsBMutated,
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
            let mutatedField = copyDoubleArray<Figure>(state.field)
            mutatedField[action.payload.i][action.payload.j] = action.payload.figure

            let lastLinePawnWMutated = {f: false, i: -1, j: -1}
            let lastLinePawnBMutated = {f: false, i: -1, j: -1}

            return {
                ...state,
                field: mutatedField,
                lastLinePawnB: lastLinePawnBMutated,
                lastLinePawnW: lastLinePawnWMutated
            }
        default:
            // In other situations the same state will be returned
            return state
    }
}