import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Ui.css';

const AnimatedButton = ({ text }) => {
    return (
        <Link to="/game" className="animated-button-link">
            <button className="animated-button">
                {text}
            </button>
        </Link>
    );
};

const UI = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="ui-container">
            <header className="header">
                <h1 className="title">Butterfly Earth</h1>
                <p className="subtitle">Save the future of our planet in this immersive experience</p>
            </header>

            <main>
                <section className="hero-section">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="hero-video"
                    >
                        <source src="/assets/web.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div className="hero-content">
                        <h2 className="hero-title">Our World will be a hell by 2050</h2>
                        <p className="hero-description">
                            Learn about factors destroying our planet because if there's a time to take action to save the planet, IT'S NOW!!!
                        </p>
                    </div>
                </section>

                <p className="topics-intro">
                    7 Distinct and Interesting Topics
                </p>

                <section className="topics-section">
                    {['The Deforestation Dilemma', 'The Climate Crisis Conundrum',
                        'Extreme Weather Challenges', 'The Biodiversity Balance', 'The Air Quality Quest',
                        'The Economic Echo', 'Social Displacement'].map((title, index) => (
                        <div
                            key={title}
                            className={`topic-card ${scrollY > 300 ? 'visible' : ''}`}
                            style={{transitionDelay: `${index * 0.2}s`}}
                        >
                            <h3 className="topic-title">{title}</h3>
                            <p className="topic-description">Learn More about This topic</p>
                        </div>
                    ))}
                </section>

                <section className="cta-section">
                    <div className="cta-video-container">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="cta-video"
                        >
                            <source src="/assets/footer.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <div className="cta-content">
                        <h2 className="cta-title">The Future is in Your Hands</h2>
                        <AnimatedButton text="Start Learning" />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UI;