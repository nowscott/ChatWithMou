import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useChatAPI from 'hooks/useChatAPI';

const TestAPIKey = ({ triggerTest, apiKey }) => {
    const [isValid, setIsValid] = useState(null);

    const { sendMessage: originalSendMessage } = useChatAPI({
        prompt: '你好',
        model: 'Qwen/Qwen1.5-7B-Chat',
        apiKey: apiKey, // 使用传入的apiKey
        maxTokens: 10,
        temperature: 0.7,
        topP: 1.0,
        topK: 50,
        frequencyPenalty: 1,
        systemPrompt: '',
        onContentUpdate: () => {
            // 收到内容回传，说明API Key有效
            setIsValid(true);
        },
        onTokenUpdate: () => { },
        onCompletion: () => { },
        onError: () => {
            setIsValid(false);
        }
    });

    const sendMessage = useCallback(() => {
        originalSendMessage();
    }, [originalSendMessage]);

    useEffect(() => {
        if (triggerTest) {
            // 设置一个定时器，1秒后检查是否收到内容回传
            const timer = setTimeout(() => {
                if (isValid === null) {
                    setIsValid(false);
                }
            }, 1000);

            sendMessage();

            // 清理定时器
            return () => clearTimeout(timer);
        }
    }, [triggerTest]);

    return (
        <div className="overflow-y-auto">
            {isValid === true ? (
                <FaCheckCircle color="lime" size="1em" />
            ) : isValid === false ? (
                <FaTimesCircle color="red" size="1em" />
            ) : null}
        </div>
    );
};

export default TestAPIKey;
