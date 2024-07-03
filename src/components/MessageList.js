import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

const MessageList = ({ messages }) => {
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, []);

    return (
        <div className="flex-1 overflow-auto bg-gray-100">
            <h1 className="text-3xl font-bold p-4 bg-white">Chat With Qwen</h1>
            <div className="p-4">
                {messages.map((message) => (
                    <div key={message.mid} className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <div>
                            <strong>{message.role === 'user' ? '你' : 'AI'}:</strong> 
                            <ReactMarkdown className="prose">{message.content}</ReactMarkdown>
                        </div>
                        <div className="text-sm text-gray-500 mt-2">{moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
                        {message.totalTokens !== null && (
                            <div className="text-sm text-gray-500">Token: {message.totalTokens}</div>
                        )}
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>
        </div>
    );
};

export default MessageList;