import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css';

const Quiz6 = ({ topic }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, [topic]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`https://butterflyearth-ayfmhgeua2bpf6hc.canadacentral-01.azurewebsites.net//${topic.toLowerCase()}`);
            const data = await response.json();
            if (!data.error) {
                setQuestions(data.questions);
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to load questions:', err);
            setLoading(false);
        }
    };

    const handleAnswerSubmit = () => {
        if (selectedAnswer === questions[currentQuestion].correct_answer) {
            setScore(prevScore => prevScore + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setQuizComplete(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setQuizComplete(false);
    };

    if (loading) return <div className="loading">Loading quiz...</div>;
    if (!questions.length) return null;

    return (
        <div className="quiz-wrapper">
            {/* Video Background */}
            <video autoPlay loop muted className="background-video" preload="auto">
                <source src="/assets/6.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="quiz-container">
                <div className="quiz-card">
                    {!quizComplete ? (
                        <>
                            <div className="quiz-header">
                                Question {currentQuestion + 1}/{questions.length}
                            </div>
                            <div className="quiz-question">
                                {questions[currentQuestion].question}
                            </div>
                            <div className="quiz-options">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedAnswer(index)}
                                        className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {selectedAnswer !== null && (
                                <button
                                    onClick={handleAnswerSubmit}
                                    className="submit-button"
                                >
                                    {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="quiz-results">
                            <h2>Quiz Complete!</h2>
                            <p>Your Score: {score} out of {questions.length}</p>
                            <p className="score-message">
                                {score === questions.length ? "Perfect score! Excellent work! 🏆" :
                                    score >= questions.length * 0.7 ? "Great job! 🌟" :
                                        score >= questions.length * 0.5 ? "Good effort! Keep practicing! 👍" :
                                            "Keep learning! You'll do better next time! 💪"}
                            </p>
                            <button
                                onClick={restartQuiz}
                                className="restart-button"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz6;