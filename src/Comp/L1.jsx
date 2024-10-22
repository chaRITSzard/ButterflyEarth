import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuizPage1 = () => {
    const [videoEnded, setVideoEnded] = useState(false);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    const handleVideoEnd = () => {
        setVideoEnded(true);
    };

    const handleQuizStart = () => {
        navigate('/quiz');
    };

    return (
        <div className="h-screen relative overflow-hidden bg-gray-900">
            {/* Video container at the top */}
            <div className="w-full mx-auto pt-4">
                <video
                    ref={videoRef}
                    className="w-auto h-100vh rounded-lg shadow-lg"
                    onEnded={handleVideoEnd}
                    controls
                >
                    <source src="/assets/Deforestation.mp4" type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Absolutely positioned button in the center */}
            {videoEnded && (
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <button
                        onClick={handleQuizStart}
                        className="
                            relative
                            group
                            px-8
                            py-4
                            bg-gradient-to-br
                            from-indigo-600
                            to-purple-600
                            text-white
                            text-xl
                            font-bold
                            rounded-xl
                            transition-all
                            duration-200
                            shadow-[0_10px_0_rgb(67,56,202)]
                            active:shadow-[0_0px_0_rgb(67,56,202)]
                            active:translate-y-2
                            hover:scale-105
                            hover:brightness-110
                            overflow-hidden
                            whitespace-nowrap
                        "
                    >
                        {/* Shine effect */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>

                        {/* Button glow effect */}
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

                        {/* Button text */}
                        <span className="relative z-10">Take the Quiz Now!</span>
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default QuizPage1;