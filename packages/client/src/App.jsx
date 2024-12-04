import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes.jsx';

const App = () => {

    // Bloque React dev tools en production
    React.useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
                for (const prop in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] === 'function') {
                        window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] = () => {};
                    }
                }
            }
        }
    }, []);

    return (
        <>
            <Router>
                <AppRoutes />
            </Router>
        </>
    );
};

export default App;