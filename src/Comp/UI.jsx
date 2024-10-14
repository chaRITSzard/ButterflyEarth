import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AnimatedButton = ({ text }) => {
    return (
        <Link to="/game" style={{ textDecoration: 'none' }}> {/* Link to /game route */}
            <button
                style={{
                    background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                    border: 'none',
                    borderRadius: '25px',
                    color: '#1a1a2e',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    padding: '15px 30px',
                    textTransform: 'uppercase',
                    transition: 'transform 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
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
        <div style={{
            background: 'linear-gradient(to bottom,#6C809A, #6279B8, #001021)', 
            color: ('#243E36', '#1B2D2A', '#F7D6E0'), 
            minHeight: '100vh', 
            fontFamily: '"Blade Runner", sans-serif',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            overflowX: 'hidden', /* Prevents horizontal overflow */
            width: '100%', 
            position: 'relative',
        }}>
            <header style={{
                padding: '2rem', 
                textAlign: 'center', 
                position: 'sticky', 
                top: 0, 
                backdropFilter: 'blur(10px)', 
                zIndex: 10,
                width: '100%', // Full width
                margin: 0,
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Butterfly Earth</h1>
                <p style={{ fontSize: '1.2rem' }}>Save the future of our planet in this immersive experience</p>
            </header>

            <main>
                <section style={{
                    height: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                    margin: 0,
                    padding: 0,
                    width: '100%', // Full width
                }}>
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 1,
                            border: '10px solid #e94560', 
                            boxSizing: 'border-box', 
                        }}
                    >
                        <source src="/web.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div style={{
                        position: 'absolute',
                        top: '90%',
                        left: '50%',
                        background:'#001021',
                        opacity: '75%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        zIndex: 1,
                        color: 'white',
                        padding: '1rem',
                        maxWidth: '90%', // Ensure text doesn't overflow on small screens
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our World will be a hell by 2050</h2>
                        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                            Learn about factors destroying our planet because if there's a time to take action to save the planet, IT'S NOW!!!
                        </p>
                    </div>
                </section>

                <p style={{
                    fontSize: '3rem', 
                    maxWidth: '600px', 
                    margin: '0 auto', 
                    fontFamily: 'sans-serif', 
                    fontStyle: 'italic', 
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    7 Distinct and Interesting Topics
                </p>

                <section style={{
                    padding: '4rem 2rem', 
                    display: 'flex', 
                    justifyContent: 'space-around', 
                    alignItems: 'center', 
                    flexWrap: 'wrap',
                    width: '100%', // Full width
                    boxSizing: 'border-box', // Ensure padding/margins are calculated correctly
                    margin: 0,
                }}>
                    {['The Deforestation Dilemma', 'The Climate Crisis Conundrum',
                     'Extreme Weather Challenges', 'The Biodiversity Balance', 'The Air Quality Quest',
                      'The Economic Echo', 'Social Displacement'].map((title, index) => (
                        <div
                            key={title}
                            style={{
                                flex: '1 1 300px',
                                margin: '1rem',
                                padding: '2rem',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '15px',
                                opacity: scrollY > 300 ? 1 : 0,
                                transform: `translateY(${scrollY > 300 ? 0 : 50}px)`,
                                transition: `opacity 0.5s ease-out ${index * 0.2}s, transform 0.5s ease-out ${index * 0.2}s`,
                                textAlign: 'center'
                            }}
                        >
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{title}</h3>
                            <p>Learn More about This topic</p>
                        </div>
                    ))}
                </section>

                <section style={{
                    height: '100vh', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    position: 'relative',
                    padding: '1rem',
                    margin: 0,
                    width: '100%', // Full width
                    boxSizing: 'border-box', // No white spaces
                }}>
                    {/* Video Background */}
                    <div style={{ 
                        position: 'relative', 
                        width: '80%', 
                        height: '50vh', 
                        border: '5px solid #e94560', 
                        boxSizing: 'border-box', 
                        overflow: 'hidden', 
                        zIndex: 0,
                        maxWidth: '800px' // Limits max width on larger screens
                    }}>
                        <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        >
                            <source src="/footer.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    {/* Overlapping Content */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        textAlign: 'center', 
                        zIndex: 1,
                        maxWidth: '90%', // Ensure text doesn't overflow on small screens
                        padding: '1rem',
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'white' }}>The Future is in Your Hands</h2>
                        <AnimatedButton text="Start Learning" />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UI;
