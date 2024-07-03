import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MessageHistory = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        setMessages(savedMessages);
    }, []);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    const addMessage = (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const updateMessage = (mid, update) => {
        setMessages(prevMessages => 
            prevMessages.map(msg => 
                msg.mid === mid ? { ...msg, ...(typeof update === 'function' ? update(msg) : update) } : msg
            )
        );
    };

    const addUserMessage = (prompt) => {
        const userMessageMid = uuidv4();
        addMessage({
            mid: userMessageMid,
            role: 'user',
            type: 'prompt',
            content: prompt,
            timestamp: new Date().toISOString(),
            totalTokens: null // 初始值为null，稍后更新
        });
        return userMessageMid;
    };

    const addAIMessage = () => {
        const aiMessageMid = uuidv4();
        addMessage({
            mid: aiMessageMid,
            role: 'ai',
            type: 'response',
            content: '',
            timestamp: new Date().toISOString(),
            totalTokens: null // 初始值为null，稍后更新
        });
        return aiMessageMid;
    };

    const clearMessages = () => {
        localStorage.removeItem('messages');
        setMessages([]);
    };
    return { messages, addMessage, updateMessage, addUserMessage, addAIMessage, clearMessages };
};

export default MessageHistory;