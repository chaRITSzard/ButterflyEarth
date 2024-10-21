import React, { useState, useEffect } from 'react';
import { XSquare, CheckSquare } from 'lucide-react';

// Animation components remain the same
const RainDrop = () => (
    <div
        className="raindrop absolute animate-fall"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 1 + 0.5}s`,
          opacity: Math.random(),
        }}
    >
      💧
    </div>
);

const Rain = () => (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => <RainDrop key={i} />)}
    </div>
);

const ConfettiPiece = () => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
  return (
      <div
          className="confetti absolute animate-confetti"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            width: '10px',
            height: '10px',
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 1 + 0.5}s`,
            opacity: Math.random(),
          }}
      />
  );
};

const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(50)].map((_, i) => <ConfettiPiece key={i} />)}
    </div>
);

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRain, setShowRain] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/deforestation', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data); // Debug log

      if (data && data.question && Array.isArray(data.question)) {
        setQuestions(data.question);
        setError(null);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (answerIndex) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setShowRain(true);
      setTimeout(() => setShowRain(false), 2000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
    fetchQuestions();
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="text-xl font-semibold text-blue-600 animate-pulse">
            Loading quiz...
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <div className="text-red-600 mb-4">{error}</div>
            <button
                onClick={fetchQuestions}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  if (quizComplete) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-6">Quiz Complete! 🎉</h2>
            <div className="text-center mb-6">
              <p className="text-xl mb-2">Your Score:</p>
              <p className="text-3xl font-bold text-green-600">
                {score} / {questions.length}
              </p>
              <p className="text-lg mt-2">
                ({Math.round((score / questions.length) * 100)}%)
              </p>
            </div>
            <button
                onClick={restartQuiz}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  if (questions.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="text-xl font-semibold text-red-600">
            No questions available. Please try again later.
          </div>
        </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        {showConfetti && <Confetti />}
        {showRain && <Rain />}

        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-sm font-medium text-blue-600">
              Score: {score}
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-lg text-left transition-all transform hover:scale-[1.01] 
                ${selectedAnswer === null
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : selectedAnswer === index
                            ? index === currentQ.correct_answer
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                            : index === currentQ.correct_answer
                                ? 'bg-green-100 border-green-500'
                                : 'bg-gray-50'
                    } relative flex items-center`}
                >
                  <span className="flex-grow">{option}</span>
                  {selectedAnswer !== null && index === currentQ.correct_answer && (
                      <CheckSquare className="text-green-600 ml-2" />
                  )}
                  {selectedAnswer === index && index !== currentQ.correct_answer && (
                      <XSquare className="text-red-600 ml-2" />
                  )}
                </button>
            ))}
          </div>

          {selectedAnswer !== null && (
              <button
                  onClick={handleNextQuestion}
                  className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </button>
          )}
        </div>
      </div>
  );
};

export default Quiz;