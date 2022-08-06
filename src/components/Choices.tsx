import React from 'react';
import {Rook} from "../models/figures/rook";
import {Knight} from "../models/figures/knight";
import {Bishop} from "../models/figures/bishop";
import {Queen} from "../models/figures/queen";
import {SIGNATURES_TO_OBJECTS} from "../models/definitions";
import {Figure} from "../models/figures/figure";
import {PlayerSide} from "../helpers/enums";
import {ChoiceAction, ChoicePayload} from "../store/actions";
import '../scss/components/choices.scss'

export interface ChoiceProps {
    playerSide: PlayerSide
    playerName: string
    i: number
    j: number

    lastLine(payload: ChoicePayload): ChoiceAction
}

const Choices = (props: ChoiceProps) => {
    const figures = [
        () => new Rook(props.playerSide),
        () => new Knight(props.playerSide),
        () => new Bishop(props.playerSide),
        () => new Queen(props.playerSide)
    ]

    const choose = (payload: ChoicePayload) => {
        props.lastLine(payload)
    }

    return (
        <div className='choices'>
            <h1>{props.playerName}, your pawn just reached the last line!</h1>
            <h2>Pick new figure:</h2>
            <div className="choices_container">
                {figures.map(value => {
                    const figure: Figure = value()
                    return <img
                        //@ts-ignore
                        src={SIGNATURES_TO_OBJECTS[figure.signature].url}
                        alt={figure.signature}
                        onClick={() => choose({playerSide: props.playerSide, i: props.i, j: props.j, figure})}
                    />
                })}
            </div>
        </div>
    );
};

export default Choices;
