import React from 'react';
import Button from './components/Button';
//import HomePage from './routes/HomePage';

const App = () => {
    return  (
    <>
        <h1>Welcome to Pawbook</h1>
        <Button 
                        label="Cliquez-moi !" 
                        onClick={() => console.log('Button clicked!')} 
                    />
    </>
    );
};

export default App;