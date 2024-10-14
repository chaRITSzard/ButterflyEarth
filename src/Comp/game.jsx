import React, { useState } from 'react';

const topics = [
  { name: "The Deforestation Dilemma", image: "/Buttons/DF.jpeg" },
  { name: "The Climate Crisis Conundrum", image: "/Buttons/CC.jpg" },
  { name: "Extreme Weather Challenges", image: "/Buttons/EWE.jpeg" },
  { name: "The Biodiversity Balance", image: "/Buttons/BL.jpeg" },
  { name: "The Air Quality Quest", image: "/Buttons/AP.jpeg" },
  { name: "The Economic Echo", image: "/Buttons/EE.jpeg" },
  { name: "Social Displacement", image: "/Buttons/SD.jpeg" }
];

const GameButton = ({ topic, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        width: '100%',
        height: '120px',
        margin: '10px 0',
        padding: 0,
        border: 'none',
        borderRadius: '15px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
      onClick={() => onClick(topic.name)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: topic.color,
        opacity: 0.7,
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
    </button>
  );
};

const SignInButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => console.log('Sign In/Register clicked')}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#4CAF50',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isHovered ? 0 : 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#45a049',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isHovered ? 1 : 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 2 }}>
        Sign In / Register
      </span>
    </button>
  );
};

const GamePage = () => {
  const handleTopicClick = (topicName) => {
    console.log(`Selected topic: ${topicName}`);

  };

  return (
    <div style={{
      padding: '20px',
      background:'#BFD7B5',
      minHeight: '100vh',
      position: 'relative',
    }}>
      <SignInButton />
      <h1 style={{
        textAlign: 'center',
        color: '#413C58',
        marginTop: '60px',
        marginBottom: '30px',
      }}>
        Welcome to <b>Butterfly Earth </b>
      </h1>
      <h2 style={{
        textAlign: 'center',
        color: '#413C58',
        marginTop: '60px',
        marginBottom: '30px',}}>
            Are you ready to learn how to save the Planet?
      </h2>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {topics.map((topic, index) => (
          <GameButton key={index} topic={topic} onClick={handleTopicClick} />
        ))}
      </div>
    </div>
  );
};

export default GamePage;