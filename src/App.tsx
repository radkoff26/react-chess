import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import GamePage from "./pages/GamePage";

export interface GameData {
    player1: string
    player2: string
    time: number
    isGameSet: boolean
}

export const defaultValue: GameData = {isGameSet: false, player1: '', player2: '', time: 5}

const App = () => {
    const appState = useState(defaultValue)

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<MainPage/>} path='/'/>
                    <Route element={<SettingsPage dispatch={appState[1]}/>} path='/settings'/>
                    <Route element={<GamePage state={appState}/>} path='/game'/>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
