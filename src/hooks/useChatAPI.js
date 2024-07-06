import { useState, useCallback } from 'react';

const useChatAPI = ({prompt,model,apiKey,maxTokens,temperature,topP,topK,
    frequencyPenalty,systemPrompt,onContentUpdate,onTokenUpdate,onCompletion
    }) => {
    const [isComplete, setIsComplete] = useState(false);
    const envApiKey = process.env.REACT_APP_API_KEY;

    const sendMessage = useCallback(() => {
        if (!prompt) return;
        setIsComplete(false);

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${envApiKey || apiKey}`
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: maxTokens,
                temperature,
                top_p: topP,
                top_k: topK,
                frequency_penalty: frequencyPenalty,
                stream: true
            })
        };

        fetch('https://api.siliconflow.cn/v1/chat/completions', options)
            .then(response => response.body.getReader())
            .then(reader => {
                const decoder = new TextDecoder('utf-8');
                const read = () => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            setIsComplete(true);
                            onCompletion && onCompletion();
                            return;
                        }
                        const text = decoder.decode(value, { stream: true });
                        text.split('\n').forEach(line => {
                            if (line.trim() && line.trim() !== 'data: [DONE]') {
                                try {
                                    const jsonResponse = JSON.parse(line.trim().replace(/^data: /, ''));
                                    const delta = jsonResponse.choices[0].delta;
                                    if (delta && delta.content) {
                                        onContentUpdate(delta.content);
                                    }
                                    if (jsonResponse.usage) {
                                        onTokenUpdate(jsonResponse.usage.total_tokens);
                                    }
                                } catch (error) {
                                    console.error('解析 JSON 时出错:', error, '行:', line);
                                }
                            }
                        });
                        read();
                    });
                };
                read();
            })
            .catch(err => {
                console.error('API 请求失败:', err);
                setIsComplete(true);
            });
    }, [prompt, model, apiKey, maxTokens, temperature, topP, topK, frequencyPenalty, 
        systemPrompt, onContentUpdate, onTokenUpdate, onCompletion, envApiKey]);

    return { sendMessage, isComplete };
};

export default useChatAPI;