import React, {memo, useEffect, useRef, useState} from 'react';
import {Step} from "../models/step";
import {convertCoordsToFieldCoords, convertSecondsToMinutesAndSeconds} from "../helpers/function_helpers";
import {FieldAction, tick} from "../store/actions";

export interface PlayerInfoProps {
    playerName: string
    playerSide: string
    timeLeft: number
    madeSteps: Step[]
    colorOfCurrentPlayer: string
    isGameOver: boolean

    tick(side: string): FieldAction
}

const PlayerInfo = memo((props: PlayerInfoProps) => {
    const tickTimeout = useRef<NodeJS.Timeout>(null)

    const tickSecInterval = () => {
        props.tick(props.playerSide)
        if (!props.isGameOver) {
            // @ts-ignore
            tickTimeout.current = setTimeout(tickSecInterval, 1000)
        }
    }

    useEffect(() => {
        if (!props.isGameOver) {
            if (props.colorOfCurrentPlayer === props.playerSide) {
                // @ts-ignore
                tickTimeout.current = setTimeout(tickSecInterval, 1000)
            } else {
                if (tickTimeout.current) {
                    clearTimeout(tickTimeout.current)
                }
            }
        } else {
            if (tickTimeout.current) {
                clearTimeout(tickTimeout.current)
            }
        }
        return () => {
            if (tickTimeout.current) {
                clearTimeout(tickTimeout.current)
            }
        }
    }, [props.colorOfCurrentPlayer, props.isGameOver])

    return (
        <div className='player_info'>
            <h1 className={(props.playerSide === 'W' ? 'white' : 'black') + '_side'}>{props.playerName}</h1>
            <p className='side'>{props.playerSide === 'W' ? 'White' : 'Black'}</p>
            <p className="countdown">Time left - <b>{convertSecondsToMinutesAndSeconds(props.timeLeft)}</b></p>
            <h2 className='title'>History</h2>
            <ul className="history">
                {
                    props.madeSteps.map(value => {
                        let newValue = `${convertCoordsToFieldCoords(value.from)} - ${convertCoordsToFieldCoords(value.to)}`
                        return <li key={newValue}>{newValue}</li>
                    })
                }
            </ul>
            <button className='surrender'>Surrender</button>
        </div>
    );
});

export default PlayerInfo;
