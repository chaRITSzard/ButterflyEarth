import React, { useEffect, useRef } from 'react';

const Stars = () => {
    const starsRef = useRef(null);

    useEffect(() => {
        const starsContainer = starsRef.current;
        const numStars = 200;
        const numShootingStars = 5;

        // Create regular stars
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 1}s`;
            starsContainer.appendChild(star);
        }

        // Create shooting stars
        const createShootingStar = () => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            starsContainer.appendChild(star);

            // Remove shooting star after animation
            star.addEventListener('animationend', () => {
                star.remove();
                createShootingStar();
            });
        };

        // Initialize shooting stars
        for (let i = 0; i < numShootingStars; i++) {
            setTimeout(() => createShootingStar(), i * 2000);
        }

        return () => {
            while (starsContainer.firstChild) {
                starsContainer.removeChild(starsContainer.firstChild);
            }
        };
    }, []);

    return <div ref={starsRef} className="stars" />;
};

export default Stars;