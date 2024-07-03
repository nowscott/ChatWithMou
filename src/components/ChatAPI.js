import { useEffect } from 'react';

const ChatAPI = ({ prompt, onContentUpdate, onTokenUpdate, model}) => {
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
                model: model,
                messages: [{ role: 'user', content: prompt }],
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
                            // console.log('流式响应已结束');
                            return;
                        }
                        const text = decoder.decode(value, { stream: true });
                        text.split('\n').forEach(line => {
                            if (line.trim() !== '' && line.trim() !== 'data: [DONE]') {  // 忽略空行和 'data: [DONE]'
                                try {
                                    const jsonResponse = JSON.parse(line.trim().replace(/^data: /, '')); // 移除前缀 'data: '
                                    const delta = jsonResponse.choices[0].delta;
                                    if (delta && delta.content) {
                                        onContentUpdate(delta.content);
                                    }
                                    if (jsonResponse.usage && jsonResponse.usage.total_tokens) {
                                        onTokenUpdate(jsonResponse.usage.total_tokens);
                                    }
                                } catch (error) {
                                    console.error('解析 JSON 时出错:', error, '行:', line);
                                }
                            }
                        });

                        read(); // 继续读取下一个数据块
                    });
                }

                read();
            })
            .catch(err => console.error('请求失败:', err));
    }, [prompt]);

    return null;
};

export default ChatAPI;