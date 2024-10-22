import React, { useState, useEffect } from 'react';

const Quiz = ({ topic }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [quizComplete, setQuizComplete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [topic]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/${topic.toLowerCase()}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setQuestions(data.questions);
            setError(null);
        } catch (err) {
            setError('Failed to load quiz questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answerIndex) => {
        if (selectedAnswer !== null || quizComplete) return;
        setSelectedAnswer(answerIndex);

        if (answerIndex === questions[currentQuestion].correct_answer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            setQuizComplete(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setQuizComplete(false);
        fetchQuestions();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <p className="text-lg">Loading quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    if (quizComplete) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                    <p className="text-xl mb-4">
                        Your score: {score} out of {questions.length}
                    </p>
                    <p className="text-lg mb-6">
                        Percentage: {((score / questions.length) * 100).toFixed(1)}%
                    </p>
                    <button
                        onClick={restartQuiz}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Question {currentQuestion + 1}/{questions.length}</h2>
                    <span className="text-lg font-semibold bg-blue-100 px-3 py-1 rounded-full">
            Score: {score}
          </span>
                </div>
                <p className="text-lg">{currentQ.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedAnswer === null
                                ? 'hover:bg-gray-100 bg-gray-50'
                                : selectedAnswer === index
                                    ? index === currentQ.correct_answer
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                    : index === currentQ.correct_answer
                                        ? 'bg-green-100'
                                        : 'bg-gray-50'
                        } ${
                            selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'
                        } disabled:opacity-70`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Quiz;