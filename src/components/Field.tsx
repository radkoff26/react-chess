import React from 'react';
import Cell, {CellProps} from "./Cell";
import {Figure} from "../models/figures/figure";
import {SIGNATURES_TO_OBJECTS} from "../models/definitions";
import '../scss/field.scss'
import {Coords} from "../logic/logic_functions";
import {includes} from "../helpers/function_helpers";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {chooseFigure, FieldAction, makeStep} from "../store/actions";

// Field State
export interface FieldState {
    field: Figure[][]
    steps: Coords[]
    pickedFigureCoords: Coords
    player: string
    isKingSafe: { W: boolean, B: boolean }
    isGameOver: boolean
}

// Mappers for Redux connect
const mapState = (state: FieldState): FieldState => (state)
const mapDispatch = (dispatch: Dispatch) => ({
    chooseFigure: (i: number, j: number): FieldAction => dispatch(chooseFigure(i, j)),
    makeStep: (i: number, j: number): FieldAction => dispatch(makeStep(i, j))
})

// Redux connection
const connector = connect(mapState, mapDispatch);
type FieldProps = ConnectedProps<typeof connector>

const Field = (props: FieldProps) => {
    return (
        <div className='field'>
            {props.isGameOver &&
            <h1 className='game_over'>Сheckmate! {props.player === 'W' ? 'White side' : 'Black side'} has won!</h1>}

            {!props.isGameOver &&
            <h1 className='step'>{props.player === 'W' ? 'White side' : 'Black side'} steps now!</h1>}

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
    );
};

// Final ConnectedField component
export const ConnectedField = connector(Field);