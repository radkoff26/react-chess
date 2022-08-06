import React, {memo, useEffect, useRef} from 'react';
import {Step} from "../models/step";
import {convertCoordsToFieldCoords, convertSecondsToMinutesAndSeconds} from "../helpers/function_helpers";
import {PlayerInfoAction} from "../store/actions";
import {PlayerSide} from "../helpers/enums";
import '../scss/components/player_info.scss'

export interface PlayerInfoProps {
    playerName: string
    playerSide: PlayerSide
    timeLeft: number
    madeSteps: Step[]
    sideOfCurrentPlayer: PlayerSide
    isGameOver: boolean

    tick(side: PlayerSide): PlayerInfoAction
    surrender(side: PlayerSide): PlayerInfoAction
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
            if (props.sideOfCurrentPlayer === props.playerSide) {
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
    }, [props.sideOfCurrentPlayer, props.isGameOver])

    return (
        <div className='player_info'>
            <h1 className={(props.playerSide === PlayerSide.W ? 'white' : 'black') + '_side'}>{props.playerName}</h1>
            <p className='side'>{props.playerSide === PlayerSide.W ? 'White' : 'Black'}</p>
            <p className="countdown">Time left - <b>{convertSecondsToMinutesAndSeconds(props.timeLeft)}</b></p>
            <h2 className='title'>History</h2>
            <ul className="history">
                {
                    props.madeSteps.map(value => {
                        let newValue = `${convertCoordsToFieldCoords(value.from)} - ${convertCoordsToFieldCoords(value.to)}`
                        return <li key={newValue}>{newValue}{value.wasBeating ? ': beat' : ''}</li>
                    })
                }
            </ul>
            <button className='surrender' onClick={() => !props.isGameOver && props.surrender(props.playerSide)}>Surrender</button>
        </div>
    );
});

export default PlayerInfo;
