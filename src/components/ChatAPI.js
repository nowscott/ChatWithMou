import { useEffect, useRef } from 'react';

const ChatAPI = ({ prompt, onContentUpdate, onTokenUpdate, model }) => {
    const stableOnContentUpdate = useRef(onContentUpdate);
    const stableOnTokenUpdate = useRef(onTokenUpdate);
    const modelRef = useRef(model);

    useEffect(() => {
        stableOnContentUpdate.current = onContentUpdate;
        stableOnTokenUpdate.current = onTokenUpdate;
        modelRef.current = model;
    }, [onContentUpdate, onTokenUpdate, model]);

    useEffect(() => {
        const apiKey = process.env.REACT_APP_API_KEY;
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelRef.current,
                messages: [
                    { role: 'system', content: `
                    1. 每当用户提供对话记录时，优先使用提供的对话记录进行回答。
                    2. 如果用户询问“我说过什么”或类似问题，检查提供的对话记录，并根据记录内容进行回答。
                    3. 遵循以下格式处理对话记录和记忆查询：
                       - 对话记录处理：当用户提供对话记录时，解析并存储记录内容。
                       - 记忆查询回应：根据提供的对话记录内容进行回答。`
                    },{role:'system',content:`回复的时候无需带上类似"AI:"的开头`},
                    { role: 'user', content: prompt }
                ],
                max_tokens: 4096,
                temperature: 0.7,
                top_p: 0.7,
                top_k: 50,
                frequency_penalty: 0.5,
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
    }, [prompt]);

    return null;
};

export default ChatAPI;