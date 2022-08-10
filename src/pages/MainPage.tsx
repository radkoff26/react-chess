import React from 'react';
import '../scss/main.scss';
import {Link} from "react-router-dom";

const MainPage = () => {
    return (
        <>
            <Link className='play' to={'/settings'}>Play</Link>
        </>
    );
};

export default MainPage;
