import React from 'react';
import {Provider} from 'react-redux';
import {ConnectedField} from "../components/Field";
import '../scss/main.scss';
import {rootReducer} from "../store/reducers";
import {configureStore} from "@reduxjs/toolkit";

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

const MainPage = () => {
    return (
        <Provider store={store}>
            <ConnectedField/>
        </Provider>
    );
};

export default MainPage;
