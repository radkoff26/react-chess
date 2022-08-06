import React, {memo} from 'react';
import {Figure} from "../models/figures/figure";
import {CellAction} from "../store/actions";
import {PlayerSide} from "../helpers/enums";
import '../scss/components/cell.scss'

// Cell Props
export interface CellProps {
    figure: Figure
    url: string
    cellColor: string
    isPossibleToStep: boolean
    i: number
    j: number
    playerSignature: PlayerSide
    isGameOver: boolean

    chooseFigure(i: number, j: number): CellAction

    makeStep(i: number, j: number): CellAction
}

const Cell = memo((props: CellProps) => {
    // Two functions below affect on the field only when current player has their step that moment

    // Function that is invoked when user intends to step
    const clickToStep = () => {
        if (props.isPossibleToStep) {
            props.makeStep(props.i, props.j)
        }
    }

    // Function that is invoked when user intends to choose figure
    const clickToChoose = () => {
        if (!props.isPossibleToStep && props.figure.side === props.playerSignature) {
            props.chooseFigure(props.i, props.j)
        }
    }

    // When setting listener it also checks if game is still not over and only then proceeds
    return (
        <div onClick={() => !props.isGameOver && clickToStep()}
             className={'cell ' + (props.cellColor === 'B' ? 'black' : 'white') + (props.isPossibleToStep ? ' step' : '')}>
            {props.url &&
            <img src={props.url} onClick={() => !props.isGameOver && clickToChoose()} alt={'figure'}/>}
        </div>
    );
});

export default Cell;
