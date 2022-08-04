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

export interface FieldState {
    field: Figure[][]
    steps: Coords[]
    pickedFigureCoords: Coords
    player: string
    isKingSafe: {W: boolean, B: boolean}
    isGameOver: boolean
}

const mapState = (state: FieldState): FieldState => (state)
const mapDispatch = (dispatch: Dispatch) => ({
    chooseFigure: (i: number, j: number): FieldAction => dispatch(chooseFigure(i, j)),
    makeStep: (i: number, j: number): FieldAction => dispatch(makeStep(i, j))
})

const connector = connect(mapState, mapDispatch);

type FieldProps = ConnectedProps<typeof connector>

const Field = (props: FieldProps) => {
    return (
        <div className='field'>
            {props.isGameOver && <h1 className='game_over'>Сheckmate! {props.player === 'W' ? 'White side' : 'Black side'} has won!</h1>}
            {!props.isGameOver && <h1 className='step'>{props.player === 'W' ? 'White side' : 'Black side'} steps now!</h1>}
            {!props.isGameOver && (!props.isKingSafe.B || !props.isKingSafe.W) && <h1 className='shah'>Shah for {!props.isKingSafe.W ? 'White side' : 'Black side'} King!</h1>}
            {props.field.map((array, i) => {
                return array.map((value: Figure, j: number) => {
                    let data: CellProps = new class implements CellProps {
                        cellColor: string = '';
                        figure: Figure = value;
                        i: number = i;
                        isPossibleToStep: boolean = includes({x: i, y: j}, props.steps);
                        j: number = j;
                        //@ts-ignore
                        url: string = SIGNATURES_TO_OBJECTS[value.signature].url;
                        playerSignature = props.player;
                        isGameOver = props.isGameOver

                        chooseFigure(i: number, j: number): FieldAction {
                            return props.chooseFigure(i, j);
                        }

                        makeStep(i: number, j: number): FieldAction {
                            return props.makeStep(i, j);
                        }
                    }
                    if ((j + (i % 2)) % 2 === 0) {
                        data.cellColor = 'B'
                    } else {
                        data.cellColor = 'W'
                    }
                    return <Cell
                        key={i + '' + j}
                        cellColor={data.cellColor}
                        url={data.url}
                        figure={data.figure}
                        isPossibleToStep={data.isPossibleToStep}
                        i={data.i}
                        j={data.j}
                        chooseFigure={data.chooseFigure}
                        makeStep={data.makeStep}
                        playerSignature={props.player}
                        isGameOver={data.isGameOver}
                    />
                })
            })}
        </div>
    );
};

export const ConnectedField = connector(Field);