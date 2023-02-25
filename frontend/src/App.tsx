import React from 'react';
import './App.css';
import {BrowserRouter, Router} from "react-router-dom";
import {AuthContainer} from './containers/AuthContainer';

function App() {
    return (
        <div className="app">

        </div>
    )
}

export default () => {
    return (
        <BrowserRouter>
            <AuthContainer.Provider>
                <App/>
            </AuthContainer.Provider>
        </BrowserRouter>
    );
}