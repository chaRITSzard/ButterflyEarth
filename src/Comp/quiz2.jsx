import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css';

const Quiz2 = ({ topic }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD
=======
    const [showBadge, setShowBadge] = useState(false);
    const [badgeEarned, setBadgeEarned] = useState(false);
    const [badgeType, setBadgeType] = useState(null);
>>>>>>> 937ea31 (Frontend revamped)

    useEffect(() => {
        fetchQuestions();
    }, [topic]);

    const fetchQuestions = async () => {
        try {
<<<<<<< HEAD
            const response = await fetch(`https://butterflyearth-ayfmhgeua2bpf6hc.canadacentral-01.azurewebsites.net//${topic.toLowerCase()}`);
=======
            const response = await fetch(`http://127.0.0.1:5000/${topic.toLowerCase()}`);
>>>>>>> 937ea31 (Frontend revamped)
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

<<<<<<< HEAD
=======
    const getBadgeInfo = (finalScore) => {
        if (finalScore >= 4) return { type: 'gold', image: '/assets/Gold.jpg', message: 'Gold Badge' };
        if (finalScore >= 3) return { type: 'silver', image: '/assets/Silver.jpg', message: 'Silver Badge' };
        if (finalScore >= 2) return { type: 'bronze', image: '/assets/Bronze.jpg', message: 'Bronze Badge' };
        return null;
    };

>>>>>>> 937ea31 (Frontend revamped)
    const handleAnswerSubmit = () => {
        if (selectedAnswer === questions[currentQuestion].correct_answer) {
            setScore(prevScore => prevScore + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setQuizComplete(true);
<<<<<<< HEAD
=======
            // Calculate final score including the last answer
            const finalScore = selectedAnswer === questions[currentQuestion].correct_answer ? score + 1 : score;
            const badgeInfo = getBadgeInfo(finalScore);

            if (badgeInfo) {
                setBadgeEarned(true);
                setShowBadge(true);
                setBadgeType(badgeInfo.type);
                // Store badge in localStorage if it's better than previous
                const badges = JSON.parse(localStorage.getItem('quizBadges') || '{}');
                const existingBadge = badges[topic] || '';
                // Only update if new badge is better than existing
                const badgeRank = { gold: 3, silver: 2, bronze: 1 };
                if (!existingBadge || badgeRank[badgeInfo.type] > badgeRank[existingBadge]) {
                    badges[topic] = badgeInfo.type;
                    localStorage.setItem('quizBadges', JSON.stringify(badges));
                }
            }
>>>>>>> 937ea31 (Frontend revamped)
        }
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setQuizComplete(false);
<<<<<<< HEAD
=======
        setShowBadge(false);
        setBadgeType(null);
    };

    const getBadgeText = (type) => {
        switch (type) {
            case 'gold':
                return 'Exceptional! You have earned a Gold Badge! 🏆';
            case 'silver':
                return 'Great work! You have earned a Silver Badge! 🥈';
            case 'bronze':
                return 'Good job! You have earned a Bronze Badge! 🥉';
            default:
                return '';
        }
>>>>>>> 937ea31 (Frontend revamped)
    };

    if (loading) return <div className="loading">Loading quiz...</div>;
    if (!questions.length) return null;

    return (
        <div className="quiz-wrapper">
<<<<<<< HEAD
            {/* Video Background */}
            <video autoPlay loop muted className="background-video" preload="auto">
                <source src="/assets/2.mp4" type="video/mp4" />
=======
            <video autoPlay loop muted className="background-video">
                <source src="/assets/7.mp4" type="video/mp4" />
>>>>>>> 937ea31 (Frontend revamped)
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
<<<<<<< HEAD
=======
                            {badgeEarned && showBadge && (
                                <div className="badge-animation">
                                    <img
                                        src={`/assets/${badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}.jpg`}
                                        alt={`${badgeType} Badge`}
                                        className="earned-badge"
                                        style={{
                                            animation: 'badgeAppear 1s ease-out'
                                        }}
                                    />
                                    <p className="badge-text">{getBadgeText(badgeType)}</p>
                                </div>
                            )}
>>>>>>> 937ea31 (Frontend revamped)
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
<<<<<<< HEAD
=======

                            <button
                                onClick={() => window.open("https://www.un.org/en/actnow", "_blank", "noopener,noreferrer")}
                                className="learn-more-button"
                            >
                                Learn more to fight Climate Change
                            </button>

                            <button
                                onClick={() => window.location.href = "/game"}
                                className="next-button"
                            >
                                Next
                            </button>


>>>>>>> 937ea31 (Frontend revamped)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz2;