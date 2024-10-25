import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UI from './Comp/UI';
import GamePage from './Comp/game';
import Quiz from './Comp/quiz'
import Quiz2 from './Comp/quiz2';
import Quiz3 from './Comp/quiz3';
import Quiz4 from './Comp/quiz4';
import Quiz5 from './Comp/quiz5';
import Quiz6 from './Comp/quiz6';
import Quiz7 from './Comp/quiz7';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UI />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/quiz" element={<Quiz topic="deforestation" />}/>
                <Route path="/quiz2" element={<Quiz2 topic="climate" />}/>
                <Route path="/quiz3" element={<Quiz3 topic="EWE" />}/>
                <Route path="/quiz4" element={<Quiz4 topic="bio_loss" />}/>
                <Route path="/quiz5" element={<Quiz5 topic="air" />}/>
                <Route path="/quiz6" element={<Quiz6 topic="EcoEffect" />}/>
                <Route path="/quiz7" element={<Quiz7 topic="Social" />}/>
            </Routes>
        </Router>
    );
};

export default App;