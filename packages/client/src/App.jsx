import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes.jsx';

const App = () => {

    // Bloque React dev tools en production
    if (process.env.NODE_ENV === 'production') {
        // Méthode plus agressive pour désactiver React DevTools
        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
                inject: () => {},
                reactDevtoolsAgent: null,
                renderers: new Map(),
                Hook: function() {},
                checkDCE: function() {}
            };
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