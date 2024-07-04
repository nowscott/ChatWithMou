import { useEffect, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const MessageHistory = () => {
    const [messages, setMessages] = useState([]);
    const isFirstRender = useRef(true);

    // 加载初始消息
    useEffect(() => {
        const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
        setMessages(savedMessages);
    }, []);

    // 保存消息到 localStorage
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            localStorage.setItem('messages', JSON.stringify(messages));
        }
    }, [messages]);

    const addMessage = useCallback((message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    }, []);

    const updateMessage = useCallback((mid, update) => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.mid === mid ? { ...msg, ...(typeof update === 'function' ? update(msg) : update) } : msg
            )
        );
    }, []);

    const addUserMessage = useCallback((prompt) => {
        const userMessageMid = uuidv4();
        addMessage({
            mid: userMessageMid,
            role: 'user',
            type: 'prompt',
            content: prompt,
            timestamp: new Date().toISOString(),
            totalTokens: null
        });
        return userMessageMid;
    }, [addMessage]);

    const addAIMessage = useCallback(() => {
        const aiMessageMid = uuidv4();
        addMessage({
            mid: aiMessageMid,
            role: 'ai',
            type: 'response',
            content: '',
            timestamp: new Date().toISOString(),
            totalTokens: null
        });
        return aiMessageMid;
    }, [addMessage]);

    const clearMessages = useCallback(() => {
        localStorage.removeItem('messages');
        setMessages([]);
    }, []);

    const deleteMessage = useCallback((mid) => {
        setMessages(prevMessages => prevMessages.filter(msg => msg.mid !== mid));
    }, []);

    return { messages, addUserMessage, addAIMessage, updateMessage, clearMessages, deleteMessage };
};

export default MessageHistory;