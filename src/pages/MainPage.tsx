import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {ConnectedField} from "../components/Field";
import '../scss/main.scss';
import {rootReducer} from "../store/reducers";

const store = createStore(rootReducer)

const MainPage = () => {
    return (
        <Provider store={store}>
            <ConnectedField/>
        </Provider>
    );
};

export default MainPage;
