import React from 'react';
import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';
import {ConnectedField} from "../components/Field";
import '../scss/main.scss';
import {fieldReducer} from "../store/reducers";
import {configureStore} from "@reduxjs/toolkit";

const reducers = combineReducers({
    fieldReducer
})

const store = createStore(fieldReducer)

const MainPage = () => {
    return (
        <Provider store={store}>
            <ConnectedField/>
        </Provider>
    );
};

export default MainPage;
