import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import GamePage from "./pages/GamePage";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
            <Route element={<MainPage/>} path='/'/>
            <Route element={<SettingsPage/>} path='/settings'/>
            <Route element={<GamePage/>} path='/game'/>
        </Routes>
    </BrowserRouter>
);
