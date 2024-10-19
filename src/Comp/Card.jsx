// QuestionBox.jsx
import React, { useState } from 'react';
import '../styles/card.css';

const QuestionBox = () => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    // Sample question - in real app this would come from props or API
    const question = {
        text: "Which of these helps reduce global warming?",
        options: [
            "Using public transport",
            "Leaving lights on when not in use",
            "Using single-use plastics",
            "Keeping the car engine running while parked"
        ],
        correctAnswer: 0
    };

    const handleAnswerSelect = (index) => {
        setSelectedAnswer(index);
    };

    return (
        <div className="question-box">
            <div className="question-header">
                <div className="header-content">
                    <div className="title-section">
                        <span className="leaf-icon">🌱</span>
                        <h2>Climate Champions</h2>
                    </div>
                    <span className="cloud-icon">☁️</span>
                </div>
            </div>

            <div className="question-content">
                <div className="question-container">
                    <h3 className="question-text">{question.text}</h3>

                    <div className="options-container">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
                            >
                <span className="option-content">
                  <span className={`option-marker ${selectedAnswer === index ? 'selected' : ''}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                    {option}
                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="question-footer">
                <div className="question-progress">
                    Question <span className="bold">1</span> of <span className="bold">10</span>
                </div>
                <button
                    className={`next-button ${selectedAnswer === null ? 'disabled' : ''}`}
                    disabled={selectedAnswer === null}
                >
                    Next Question →
                </button>
            </div>
        </div>
    );
};

export default QuestionBox;
