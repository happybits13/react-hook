import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

import AuthContextProvider from './context/auth-context';

// Allows component from <app> to listen to global var defined in AutHContextProvider
ReactDOM.render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>, 
document.getElementById('root'));
