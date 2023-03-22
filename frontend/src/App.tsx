import React from 'react';
import './App.css';
import {BrowserRouter, Router} from "react-router-dom";
import {AuthContainer} from './containers/AuthContainer';
import {Route} from "react-router";
import {SocialAuthCallback} from "./components/SocialAuthCallback";

function App() {
    return (
        <div className="app">
            <Route path="/authentication/redirect" element={<SocialAuthCallback/>} />
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