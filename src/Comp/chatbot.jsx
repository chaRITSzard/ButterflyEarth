import React, { useState, useRef, useEffect } from 'react';

const ChatMessage = ({ message }) => (
    <div style={{
        display: 'flex',
        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '12px'
    }}>
        <div style={{
            maxWidth: '70%',
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: message.role === 'user' ? '#2563eb' : '#f3f4f6',
            color: message.role === 'user' ? 'white' : 'black',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}>
            {message.content}
        </div>
    </div>
);

const LoadingIndicator = () => (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
        <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            gap: '4px'
        }}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#94a3b8',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite',
                        animationDelay: `${i * 0.2}s`
                    }}
                />
            ))}
        </div>
    </div>
);

const Chatbot = ({ apiEndpoint }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am an AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Encode the user input for URL
            const encodedMessage = encodeURIComponent(input);
            // Construct the URL with query parameter
            const url = `${apiEndpoint}?message=${encodedMessage}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || data // Handle both {response: "..."} and direct string response
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'white',
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f8fafc'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1e293b'
                }}>
                    AI Assistant
                </h1>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                backgroundColor: 'white'
            }}>
                {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}
                {isLoading && <LoadingIndicator />}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
                onSubmit={handleSubmit}
                style={{
                    padding: '16px',
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: 'white'
                }}
            >
                <div style={{
                    display: 'flex',
                    gap: '12px'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '16px',
                            outline: 'none'
                        }}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            opacity: isLoading ? 0.7 : 1
                        }}
                    >
                        Send
                    </button>
                </div>
            </form>

            <style>
                {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
        `}
            </style>
        </div>
    );
};

export default Chatbot;