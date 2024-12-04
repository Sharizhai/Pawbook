import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes.jsx';

const App = () => {
    if (process.env.NODE_ENV === 'production') {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
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