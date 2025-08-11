import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UI from './Comp/UI';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UI />} />
            </Routes>
        </Router>
    );
};

export default App;