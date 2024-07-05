import { useEffect, useRef } from 'react';

let systemPrompt0 = `
1. 每当用户提供对话记录时，优先使用提供的对话记录进行回答。
2. 如果用户询问“我说过什么”或类似问题，检查提供的对话记录，并根据记录内容进行回答。
3. 不需要提供类似“AI:”的前缀！！！
`;

const ChatAPI = ({ prompt, onContentUpdate, onTokenUpdate, onCompletion, model, apiKey, maxTokens, temperature, 
    topP, topK, frequencyPenalty, systemPrompt }) => {
    const stableOnContentUpdate = useRef(onContentUpdate);
    const stableOnTokenUpdate = useRef(onTokenUpdate);
    const modelRef = useRef(model);
    const apiKeyRef = useRef(apiKey);
    const maxTokensRef = useRef(maxTokens);
    const temperatureRef = useRef(temperature);
    const topPRef = useRef(topP);
    const topKRef = useRef(topK);
    const frequencyPenaltyRef = useRef(frequencyPenalty);
    const systemPromptRef = useRef(systemPrompt);
    const envapikeyRef = useRef(process.env.REACT_APP_API_KEY);
    const isCompleteRef = useRef(false);

    useEffect(() => {
        stableOnContentUpdate.current = onContentUpdate;
        stableOnTokenUpdate.current = onTokenUpdate;
        modelRef.current = model;
        apiKeyRef.current = apiKey;
        maxTokensRef.current = maxTokens;
        temperatureRef.current = temperature;
        topPRef.current = topP;
        topKRef.current = topK;
        frequencyPenaltyRef.current = frequencyPenalty;
        systemPromptRef.current = systemPrompt;
    }, [onContentUpdate, onTokenUpdate, model, apiKey, maxTokens, temperature, topP, topK, frequencyPenalty, systemPrompt]);

    useEffect(() => {
        if (!prompt) return;
        isCompleteRef.current = false;
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${envapikeyRef.current}`
            },
            body: JSON.stringify({
                model: modelRef.current,
                messages: [
                    { role: 'system', content: systemPrompt0 },
                    { role: 'system', content: systemPromptRef.current },
                    { role: 'user', content: prompt }
                ],
                max_tokens: maxTokensRef.current,
                temperature: temperatureRef.current,
                top_p: topPRef.current,
                top_k: topKRef.current,
                frequency_penalty: frequencyPenaltyRef.current,
                stream: true
            })
        };

        fetch('https://api.siliconflow.cn/v1/chat/completions', options)
            .then(response => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                function read() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            isCompleteRef.current = true;
                            onCompletion();
                            return;
                        }
                        const text = decoder.decode(value, { stream: true });
                        text.split('\n').forEach(line => {
                            if (line.trim() !== '' && line.trim() !== 'data: [DONE]') {
                                try {
                                    const jsonResponse = JSON.parse(line.trim().replace(/^data: /, ''));
                                    const delta = jsonResponse.choices[0].delta;
                                    if (delta && delta.content) {
                                        stableOnContentUpdate.current(delta.content);
                                    }
                                    if (jsonResponse.usage && jsonResponse.usage.total_tokens) {
                                        stableOnTokenUpdate.current(jsonResponse.usage.total_tokens);
                                    }
                                } catch (error) {
                                    console.error('解析 JSON 时出错:', error, '行:', line);
                                }
                            }
                        });
                        read();
                    });
                }
                read();
            })
            .catch(err => console.error('请求失败:', err));
    }, [prompt, onCompletion]);
    
    return null;
};

export default ChatAPI;