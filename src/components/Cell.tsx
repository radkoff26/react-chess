import React, {memo} from 'react';
import {Figure} from "../models/figures/figure";
import {CHOOSE_FIGURE, FieldAction, MAKE_STEP} from "../store/actions";

export interface CellProps {
    figure: Figure
    url: string
    cellColor: string
    isPossibleToStep: boolean
    i: number
    j: number

    chooseFigure(i: number, j: number): FieldAction

    makeStep(i: number, j: number): FieldAction
}

const Cell = memo((props: CellProps) => {
    const click = () => {
        if (props.isPossibleToStep) {
            props.makeStep(props.i, props.j)
        }
    }
    return (
        <div onClick={() => click()}
             className={'cell ' + (props.cellColor === 'B' ? 'black' : 'white') + (props.isPossibleToStep ? ' step' : '')}>
            {props.url &&
            <img src={props.url} onClick={() => !props.isPossibleToStep && props.chooseFigure(props.i, props.j)}
                 alt={'figure'}/>}
        </div>
    );
});

export default Cell;
