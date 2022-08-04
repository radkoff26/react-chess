import React, {memo} from 'react';
import {Figure} from "../models/figures/figure";
import {FieldAction} from "../store/actions";

export interface CellProps {
    figure: Figure
    url: string
    cellColor: string
    isPossibleToStep: boolean
    i: number
    j: number
    playerSignature: string
    isGameOver: boolean

    chooseFigure(i: number, j: number): FieldAction

    makeStep(i: number, j: number): FieldAction
}

const Cell = memo((props: CellProps) => {
    const clickToStep = () => {
        if (props.isPossibleToStep) {
            props.makeStep(props.i, props.j)
        }
    }

    const clickToChoose = () => {
        if (!props.isPossibleToStep && props.figure.color === props.playerSignature) {
            props.chooseFigure(props.i, props.j)
        }
    }

    return (
        <div onClick={() => !props.isGameOver && clickToStep()}
             className={'cell ' + (props.cellColor === 'B' ? 'black' : 'white') + (props.isPossibleToStep ? ' step' : '')}>
            {props.url &&
            <img src={props.url} onClick={() => !props.isGameOver && clickToChoose()} alt={'figure'}/>}
        </div>
    );
});

export default Cell;
