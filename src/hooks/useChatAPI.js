import { useState, useCallback } from 'react';

const useChatAPI = ({
  prompt,
  model,
  apiKey,
  maxTokens,
  temperature,
  topP,
  topK,
  frequencyPenalty,
  systemPrompt,
  onContentUpdate,
  onTokenUpdate,
  onCompletion,
}) => {
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(() => {
    // 前置检查
    if (!apiKey) {
      console.error('API Key 缺失');
      setError('API Key 缺失');
      return;
    }
    if (!prompt) {
      console.error('Prompt 缺失');
      setError('Prompt 缺失');
      return;
    }

    setIsComplete(false);
    setError(null);
    const controller = new AbortController();
    const { signal } = controller;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
        top_p: topP,
        top_k: topK,
        frequency_penalty: frequencyPenalty,
        stream: true,
      }),
      signal,
    };

    fetch('https://api.siliconflow.cn/v1/chat/completions', options)
      .then(response => {
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        return response.body.getReader();
      })
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
        setError('请求失败，请稍后重试。');
        setIsComplete(true);
      });

    return () => controller.abort();
  }, [
    prompt,
    model,
    apiKey,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    systemPrompt,
    onContentUpdate,
    onTokenUpdate,
    onCompletion,
  ]);

  return { sendMessage, isComplete, error };
};

export default useChatAPI;