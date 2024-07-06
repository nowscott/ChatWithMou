import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useChatAPI from 'hooks/useChatAPI';

const TestAPIKey = ({ triggerTest }) => {
    const [isValid, setIsValid] = useState(null); // null: 尚未测试, true: 有效, false: 无效

    const { sendMessage } = useChatAPI({
        prompt: '你好',
        model: 'text-davinci-003', // 替换为你的模型名称
        apiKey: '你的API密钥', // 替换为你的API密钥
        maxTokens: 1,
        temperature: 0.7,
        topP: 1.0,
        topK: 50,
        frequencyPenalty: 1,
        systemPrompt: '',
        onContentUpdate: () => {},
        onTokenUpdate: () => {},
        onCompletion: () => setIsValid(true),
        onError: () => setIsValid(false) // 处理错误，设置为无效
    });

    useEffect(() => {
        if (triggerTest) {
            setIsValid(null); // 重置状态
            sendMessage();
        }
    }, [triggerTest, sendMessage]);

    return (
        <div className="mt-4">
            {isValid === null && <p>尚未测试</p>}
            {isValid === true && <FaCheckCircle color="green" size="2em" />}
            {isValid === false && <FaTimesCircle color="red" size="2em" />}
        </div>
    );
};

export default TestAPIKey;