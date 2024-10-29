<<<<<<< HEAD
import React from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 937ea31 (Frontend revamped)
import { useNavigate } from 'react-router-dom';
import '../styles/game.css';

const topics = [
    { name: "The Deforestation Dilemma", image: "/Buttons/DF.jpeg" },
    { name: "The Climate Crisis Conundrum", image: "/Buttons/CC.jpg" },
    { name: "Extreme Weather Challenges", image: "/Buttons/EWE.jpeg" },
    { name: "The Biodiversity Balance", image: "/Buttons/BL.jpeg" },
    { name: "The Air Quality Quest", image: "/Buttons/AP.jpeg" },
    { name: "The Economic Echo", image: "/Buttons/EE.jpeg" },
    { name: "Social Displacement", image: "/Buttons/SD.jpeg" }
];

<<<<<<< HEAD
const GameButton = ({ topic, onClick, isLast }) => {
=======
const GameButton = ({ topic, onClick, isLast, hasBadge }) => {
>>>>>>> 937ea31 (Frontend revamped)
    return (
        <button
            style={{
                width: isLast ? '33%' : '33%',
                height: '120px',
                margin: '10px',
                padding: 0,
                border: 'none',
                borderRadius: '15px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                transform: 'scale(1)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            }}
            onClick={() => onClick(topic.name)}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${topic.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)',
                transition: 'transform 0.3s ease-in-out',
            }} />
            <h2 style={{
                position: 'relative',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                margin: 0,
                padding: '20px',
                zIndex: 2,
            }}>
                {topic.name}
            </h2>
<<<<<<< HEAD
=======
            {hasBadge && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '30px',
                    height: '30px',
                    zIndex: 3,
                }}>
                    <img
                        src={`/Badges/${topic.name.replace(/\s+/g, '')}.jpg`}
                        alt="Badge"
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: '2px solid gold',
                        }}
                    />
                </div>
            )}
>>>>>>> 937ea31 (Frontend revamped)
        </button>
    );
};

const GamePage = () => {
    const navigate = useNavigate();
<<<<<<< HEAD

    const handleTopicClick = (topicName) => {
        console.log(`Selected topic: ${topicName}`);
        if (topicName === "The Deforestation Dilemma") {
            navigate('/quiz');
        }
        if (topicName === "The Climate Crisis Conundrum") {
            navigate('/quiz2');
        }
        if (topicName === "Extreme Weather Challenges") {
            navigate('/quiz3');
        }
        if (topicName === "The Biodiversity Balance") {
            navigate('/quiz4');
        }
        if (topicName === "The Air Quality Quest") {
            navigate('/quiz5');
        }
        if (topicName === "The Economic Echo") {
            navigate('/quiz6');
        }
        if (topicName === "Social Displacement") {
            navigate('/quiz7');
        }
    };

    const handleChatbotClick = () => {
        navigate('/chatbot'); // Navigate to your chatbot route
=======
    const [earnedBadges, setEarnedBadges] = useState({});
    const [showBadgeInventory, setShowBadgeInventory] = useState(false);

    useEffect(() => {
        const badges = JSON.parse(localStorage.getItem('quizBadges') || '{}');
        setEarnedBadges(badges);
    }, []);

    const handleTopicClick = (topicName) => {
        console.log(`Selected topic: ${topicName}`);
        const routes = {
            "The Deforestation Dilemma": '/quiz',
            "The Climate Crisis Conundrum": '/quiz2',
            "Extreme Weather Challenges": '/quiz3',
            "The Biodiversity Balance": '/quiz4',
            "The Air Quality Quest": '/quiz5',
            "The Economic Echo": '/quiz6',
            "Social Displacement": '/quiz7'
        };
        navigate(routes[topicName]);
    };

    const handleChatbotClick = () => {
        navigate('/chatbot');
    };

    const toggleBadgeInventory = () => {
        setShowBadgeInventory(!showBadgeInventory);
>>>>>>> 937ea31 (Frontend revamped)
    };

    const mainTopics = topics.slice(0, 6);
    const lastTopic = topics[6];

    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
        }}>
<<<<<<< HEAD
            {/* Video Background */}
=======
>>>>>>> 937ea31 (Frontend revamped)
            <video
                autoPlay
                loop
                muted
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: -1,
                }}
            >
                <source src="/assets/Level.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

<<<<<<< HEAD
            {/* Page Content */}
=======
>>>>>>> 937ea31 (Frontend revamped)
            <h1 style={{
                textAlign: 'center',
                color: '#fff',
                marginTop: '60px',
                marginBottom: '30px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}>
                Welcome to <b>Butterfly Earth</b>
            </h1>
            <h2 style={{
                textAlign: 'center',
                color: '#fff',
                marginBottom: '30px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}>
                Are you ready to learn how to save the Planet?
            </h2>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px',
            }}>
                {mainTopics.map((topic, index) => (
<<<<<<< HEAD
                    <GameButton key={index} topic={topic} onClick={handleTopicClick} />
                ))}
            </div>

            {/* Last button container */}
=======
                    <GameButton
                        key={index}
                        topic={topic}
                        onClick={handleTopicClick}
                        hasBadge={earnedBadges[topic.name]}
                    />
                ))}
            </div>

>>>>>>> 937ea31 (Frontend revamped)
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
            }}>
<<<<<<< HEAD
                <GameButton topic={lastTopic} onClick={handleTopicClick} isLast={true} />
            </div>

            {/* Chatbot Icon */}
=======
                <GameButton
                    topic={lastTopic}
                    onClick={handleTopicClick}
                    isLast={true}
                    hasBadge={earnedBadges[lastTopic.name]}
                />
            </div>


            {/* Chatbot Button (Right Side) */}
>>>>>>> 937ea31 (Frontend revamped)
            <div
                onClick={handleChatbotClick}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    zIndex: 1000,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <img
                    src="/assets/chat.png"
                    alt="Ask Me Anything"
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        marginBottom: '5px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                />
                <span style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                }}>
                    Ask Me Anything
                </span>
            </div>
<<<<<<< HEAD
=======

            {/* Badge Inventory Modal */}
            {showBadgeInventory && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    padding: '20px',
                    borderRadius: '15px',
                    zIndex: 1001,
                    maxWidth: '80%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                }}>
                    <h2 style={{
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: '20px'
                    }}>
                        Your Earned Badges
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '20px',
                        padding: '20px',
                    }}>
                        {topics.map((topic, index) => (
                            earnedBadges[topic.name] && (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}>
                                    <img
                                        src={`/Badges/${topic.name.replace(/\s+/g, '')}.jpg`}
                                        alt={`${topic.name} Badge`}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            border: '3px solid gold',
                                            marginBottom: '10px',
                                        }}
                                    />
                                    <span style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                    }}>
                                        {topic.name}
                                    </span>
                                </div>
                            )
                        ))}
                    </div>
                    <button
                        onClick={toggleBadgeInventory}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            cursor: 'pointer',
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
>>>>>>> 937ea31 (Frontend revamped)
        </div>
    );
};

export default GamePage;