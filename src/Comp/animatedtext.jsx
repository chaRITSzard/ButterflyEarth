import React, { useState, useEffect, useCallback, useRef } from 'react';

const AnimatedText = () => {
    const [blobPosition, setBlobPosition] = useState({ x: 0, y: 0 });
    const textRef = useRef(null);
    const intervalRef = useRef(null);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const text = "WELCOME TO BUTTERFLY EARTH";

    const handlePointerMove = useCallback((event) => {
        const { clientX, clientY } = event;
        setBlobPosition({ x: clientX, y: clientY });
    }, []);

    useEffect(() => {
        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, [handlePointerMove]);

    const handleMouseOver = useCallback(() => {
        let iteration = 0;

        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (textRef.current) {
                textRef.current.innerText = text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iteration >= text.length) {
                    clearInterval(intervalRef.current);
                }

                iteration += 1 / 3;
            }
        }, 30);
    }, []);

    useEffect(() => {
        // Initial text scramble effect
        handleMouseOver();

        return () => clearInterval(intervalRef.current);
    }, [handleMouseOver]);

    return (
        <div className="animated-text-container">
            <div
                className="text-blob"
                style={{
                    width: '150px',
                    height: '150px',
                    left: `${blobPosition.x}px`,
                    top: `${blobPosition.y}px`,
                    transform: 'translate(-50%, -50%)'
                }}
            />
            <h1
                ref={textRef}
                onMouseOver={handleMouseOver}
                data-value={text}
                className="animated-text"
            >
                {text}
            </h1>
        </div>
    );
};

export default AnimatedText;