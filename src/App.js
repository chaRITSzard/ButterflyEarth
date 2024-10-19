import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UI from './Comp/UI';
import GamePage from './Comp/game';
import EarthGlobe from "./Comp/earth";
import QuestionBox from "./Comp/Card";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UI />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/card" element={<QuestionBox />} />
                <Route path="/earth" element={<EarthGlobe />} />  {/* New route for Earth3D */}
            </Routes>
        </Router>
    );
};

export default App;