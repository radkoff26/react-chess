import React, {memo} from 'react';
import {Figure} from "../models/figures/figure";

export interface CellProps {
    figure: Figure
    url: string
    cellColor: string
    isPossibleToStep: boolean
    i: number
    j: number

    callbackToChoose(i: number, j: number): void
    callbackToMakeStep(i: number, j: number): void
}

const Cell = memo((props: CellProps) => {
    const click = () => {
        if (props.isPossibleToStep) {
            props.callbackToMakeStep(props.i, props.j)
        }
    }
    return (
        <div onClick={() => click()}
            className={'cell ' + (props.cellColor === 'B' ? 'black' : 'white') + (props.isPossibleToStep ? ' step' : '')}>
            {props.url &&
            <img src={props.url} onClick={() => props.callbackToChoose(props.i, props.j)} alt={'figure'}/>}
        </div>
    );
});

export default Cell;
