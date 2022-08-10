import React, {useEffect, useReducer, useState} from 'react';
import {defaultValue, GameData} from "../App";
import {AnyAction} from "redux";
import '../scss/settings.scss'
import {Link, useNavigate} from "react-router-dom";

export interface SettingsProps {
    dispatch: React.Dispatch<React.SetStateAction<GameData>>
}

const SET_PLAYER1 = 'SET_PLAYER1'
const SET_PLAYER2 = 'SET_PLAYER2'
const SET_TIME = 'SET_TIME'

type SET_PLAYER1_TYPE = typeof SET_PLAYER1
type SET_PLAYER2_TYPE = typeof SET_PLAYER2
type SET_TIME_TYPE = typeof SET_TIME

interface Player1Action extends AnyAction{
    type: SET_PLAYER1_TYPE
    payload: string
}

interface Player2Action extends AnyAction{
    type: SET_PLAYER2_TYPE
    payload: string
}

interface TimeAction extends AnyAction{
    type: SET_TIME_TYPE
    payload: number
}

type SettingsAction = Player1Action | Player2Action | TimeAction

const player1 = (name: string): Player1Action => ({type: SET_PLAYER1, payload: name})
const player2 = (name: string): Player2Action => ({type: SET_PLAYER2, payload: name})
const time = (time: number): TimeAction => ({type: SET_TIME, payload: time})

const SettingsPage = (props: SettingsProps) => {
    const navigate = useNavigate()

    const [error, setError] = useState('')

    const [state, dispatch] = useReducer((state: GameData, action: SettingsAction): GameData => {
        switch (action.type) {
            case SET_PLAYER1:
                return {...state, player1: action.payload}
            case SET_PLAYER2:
                return {...state, player2: action.payload}
            case SET_TIME:
                return {...state, time: action.payload}
            default:
                return state
        }
    }, defaultValue)

    useEffect(() => {
        console.log(state)
    }, [state])

    const start = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!(state.player1 && state.player2)) {
            setError('Name can\'t be empty!')
            e.preventDefault()
        } else {
            props.dispatch({...state, isGameSet: true})
        }
    }

    return (
        <div className='settings'>
            <input type="text" placeholder='Player 1' onChange={e => dispatch(player1(e.target.value))}/>
            <input type="text" placeholder='Player 2' onChange={e => dispatch(player2(e.target.value))}/>
            <select defaultValue="5" onChange={e => dispatch(time(Number(e.target.value)))}>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
            </select>
            <p>{error}</p>
            <Link to='/game' onClick={(e) => start(e)}>Let's go!</Link>
        </div>
    );
};

export default SettingsPage;
