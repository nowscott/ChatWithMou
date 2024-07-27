// utils/streamUtils.js

export const handleStreamResponse = async (reader, onContentUpdate, onTokenUpdate, onCompletion) => {
  const decoder = new TextDecoder('utf-8');
  let shouldStop = false;

  const read = async () => {
    if (shouldStop) return;

    try {
      const { done, value } = await reader.read();
      if (done) {
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
            if (jsonResponse.choices[0].finish_reason === "stop") {
              shouldStop = true;
              return;
            }
          } catch (error) {
            console.error('解析 JSON 时出错:', error, '行:', line);
          }
        }
      });

      if (!shouldStop) {
        read();
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('请求被中止');
      } else {
        console.error('读取流时出错:', err);
      }
    }
  };

  read();
};