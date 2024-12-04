import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes.jsx';

const App = () => {
    if (process.env.NODE_ENV === 'production') {
        try {
            Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
                value: {},
                writable: false,
                configurable: false
            });
        } catch (e) {
            console.warn('Could not disable React DevTools');
        }
    }

    return (
        <>
            <Router>
                <AppRoutes />
            </Router>
        </>
    );
};

export default App;