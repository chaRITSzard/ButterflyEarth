import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UI from './Comp/UI';
import GamePage from './Comp/game';
import QuizPage1 from './Comp/L1';
import Quiz from './Comp/quiz'
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UI />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/L1" element={<QuizPage1 />}/>
                <Route path="/quiz" element={<Quiz />}/>
            </Routes>
        </Router>
    );
};

export default App;