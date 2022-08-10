import React, {useContext, useLayoutEffect} from 'react';
import Cell from "./Cell";
import {Figure} from "../models/figures/figure";
import {SIGNATURES_TO_OBJECTS} from "../models/definitions";
import '../scss/components/field.scss'
import {Coords} from "../logic/logic_functions";
import {includes} from "../helpers/function_helpers";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {
    adjustGame,
    CellAction,
    ChoiceAction,
    ChoicePayload,
    chooseFigure, GameAdjustmentAction,
    lastLine,
    makeStep,
    PlayerInfoAction,
    surrender,
    tick
} from "../store/actions";
import PlayerInfo from "./PlayerInfo";
import {Step} from "../models/step";
import {PlayerSide} from "../helpers/enums";
import Choices from "./Choices";
import {GameData} from "../App";
import {GameContext} from "../pages/GamePage";

// Game State
export interface GameState {
    field: Figure[][]
    steps: Coords[]
    pickedFigureCoords: Coords
    player: PlayerSide
    isKingSafe: { W: boolean, B: boolean }
    isGameOver: boolean
    playersInGame: { W: string, B: string }
    winner: PlayerSide
    timeLeftForW: number
    timeLeftForB: number
    madeStepsW: Step[]
    madeStepsB: Step[]
    lastLinePawnW: { f: boolean, i: number, j: number }
    lastLinePawnB: { f: boolean, i: number, j: number }
}

// Mappers for Redux connect
const mapState = (state: GameState): GameState => (state)
const mapDispatch = (dispatch: Dispatch) => ({
    chooseFigure: (i: number, j: number): CellAction => dispatch(chooseFigure(i, j)),
    makeStep: (i: number, j: number): CellAction => dispatch(makeStep(i, j)),
    tick: (side: PlayerSide): PlayerInfoAction => dispatch(tick(side)),
    surrender: (side: PlayerSide): PlayerInfoAction => dispatch(surrender(side)),
    lastLine: (payload: ChoicePayload): ChoiceAction => dispatch(lastLine(payload)),
    adjustGame: (payload: GameData): GameAdjustmentAction => dispatch(adjustGame(payload)),
})

// Redux connection
const connector = connect(mapState, mapDispatch);
type FieldProps = ConnectedProps<typeof connector>

const letterArray = 'ABCDEFGH'.split('')
const digitArray = '12345678'.split('')

const Field = (props: FieldProps) => {
    const gameData = useContext(GameContext)

    useLayoutEffect(() => {
        console.log("GAME DATA: ", gameData)
        props.adjustGame(gameData)
    }, [])

    return (
        <>
            {(props.lastLinePawnW.f || props.lastLinePawnB.f) &&
            <Choices
                playerSide={props.lastLinePawnW.f ? PlayerSide.W : PlayerSide.B}
                playerName={props.lastLinePawnW.f ? props.playersInGame.W : props.playersInGame.B}
                i={props.lastLinePawnW.f ? props.lastLinePawnW.i : props.lastLinePawnB.i}
                j={props.lastLinePawnW.f ? props.lastLinePawnW.j : props.lastLinePawnB.j}
                lastLine={props.lastLine}
            />}
            <PlayerInfo
                playerSide={PlayerSide.W}
                playerName={props.playersInGame.W}
                madeSteps={props.madeStepsW}
                timeLeft={props.timeLeftForW}
                sideOfCurrentPlayer={props.player}
                tick={props.tick}
                isGameOver={props.isGameOver}
                surrender={props.surrender}
            />
            <div className='field_container'>
                <div className='field'>
                    <div className='letters_top'>
                        {letterArray.map(value => (
                            <div key={value + 't'}>{value}</div>
                        ))}
                    </div>
                    <div className='letters_bottom'>
                        {letterArray.map(value => (
                            <div key={value + 'b'}>{value}</div>
                        ))}
                    </div>
                    <div className='digits_left'>
                        {digitArray.map(value => (
                            <div key={value + 'l'}>{value}</div>
                        ))}
                    </div>
                    <div className='digits_right'>
                        {digitArray.map(value => (
                            <div key={value + 'r'}>{value}</div>
                        ))}
                    </div>

                    {props.isGameOver &&
                    <h1 className='game_over'>Сheckmate! {props.winner === PlayerSide.W ? 'White side' : 'Black side'} has
                        won!</h1>}

                    {!props.isGameOver &&
                    <h1 className='step'>{props.player === PlayerSide.W ? 'White side' : 'Black side'} steps now!</h1>}

                    {!props.isGameOver && (!props.isKingSafe.B || !props.isKingSafe.W) &&
                    <h1 className='shah'>Shah for {!props.isKingSafe.W ? 'White side' : 'Black side'} King!</h1>}

                    {props.field.map((array, i) => {
                        return array.map((value: Figure, j: number) => {
                            // Construct Cell component
                            let cellColor

                            if ((j + (i % 2)) % 2 === 0) {
                                cellColor = 'B'
                            } else {
                                cellColor = 'W'
                            }

                            return <Cell
                                key={i + '' + j}
                                cellColor={cellColor}
                                //@ts-ignore
                                url={SIGNATURES_TO_OBJECTS[value.signature].url}
                                figure={value}
                                isPossibleToStep={includes({x: i, y: j}, props.steps)}
                                i={i}
                                j={j}
                                chooseFigure={props.chooseFigure}
                                makeStep={props.makeStep}
                                playerSignature={props.player}
                                isGameOver={props.isGameOver}
                            />
                        })
                    })}
                </div>
            </div>
            <PlayerInfo
                playerSide={PlayerSide.B}
                playerName={props.playersInGame.B}
                madeSteps={props.madeStepsB}
                timeLeft={props.timeLeftForB}
                sideOfCurrentPlayer={props.player}
                tick={props.tick}
                isGameOver={props.isGameOver}
                surrender={props.surrender}
            />
        </>
    );
};


// Final ConnectedField component
const ConnectedField = connector(Field);

export default ConnectedField