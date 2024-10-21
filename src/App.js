import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UI from './Comp/UI';
import GamePage from './Comp/game';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UI />} />
                <Route path="/game" element={<GamePage />} />
            </Routes>
        </Router>
    );
};

export default App;