import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Provider} from 'react-redux';
import ConnectedField from "../components/Field";
import {rootReducer} from "../store/reducers";
import {configureStore} from "@reduxjs/toolkit";
import {useNavigate} from "react-router-dom";
import {defaultValue, GameData} from "../App";

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export interface GameProps {
    state: [GameData, React.Dispatch<React.SetStateAction<GameData>>]
}

export const GameContext = React.createContext({isGameSet: false, player1: '', player2: '', time: 5})

const GamePage = (props: GameProps) => {
    const navigate = useNavigate()

    const [startValue, setStartValue] = useState(defaultValue)

    useEffect(() => {
        if (!props.state[0].isGameSet) {
            navigate('/settings')
        } else {
            setStartValue(props.state[0])
            props.state[1](defaultValue)
        }
    }, [])

    return (
        <>
            {
                startValue.isGameSet &&
                <GameContext.Provider value={startValue}>
                    <Provider store={store}>
                        <ConnectedField/>
                    </Provider>
                </GameContext.Provider>
            }
        </>
    );
};

export default GamePage;
