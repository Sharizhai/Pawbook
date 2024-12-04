import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes.jsx';

const App = () => {

    // Bloque React dev tools en production
    if (process.env.NODE_ENV === 'production') {
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent = null;
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