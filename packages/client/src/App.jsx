import React, { useState, useEffect } from 'react';
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

    // useEffect(() => {
    //     if (process.env.NODE_ENV === 'development') {
    //         const disableRightClick = (e) => {
    //             e.preventDefault();
    //         };

    //         const disableShortcuts = (e) => {
    //             if (
    //                 e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J') || 
    //                 e.ctrlKey && e.key === 'U' || 
    //                 e.key === 'F12'
    //             ) {
    //                 e.preventDefault();
    //             }
    //         };

    //         document.addEventListener('contextmenu', disableRightClick);
    //         document.addEventListener('keydown', disableShortcuts);

    //         return () => {
    //             document.removeEventListener('contextmenu', disableRightClick);
    //             document.removeEventListener('keydown', disableShortcuts);
    //         };
    //     }
    // }, []);


    return (
        <>
            <Router>
                <AppRoutes />
            </Router>
        </>
    );
};

export default App;