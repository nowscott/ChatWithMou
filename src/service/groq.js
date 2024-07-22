import Groq from "groq-sdk";

const apiKey = process.env.REACT_APP_GROQ_API_KEY;
if (!apiKey) {
  throw new Error("Groq API Key 缺失");
}

const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

export function sendGroqMessage({
  prompt,
  model,
  maxTokens,
  temperature,
  topP,
  topK,
  frequencyPenalty,
  systemPrompt,
  onContentUpdate,
  onTokenUpdate,
  onCompletion,
}) {
  const controller = new AbortController();

  const fetchChatCompletion = async () => {
    try {
      console.log(model,'API 请求中...');
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        model,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        stream: true,
        stop: null,
      });

      let buffer = '';

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || '';
        // console.log('content', content);
        buffer += content;
        onContentUpdate(buffer);
        buffer = '';
        if (chunk.x_groq && chunk.x_groq.usage) {
          onTokenUpdate(chunk.x_groq.usage.total_tokens);
        }
      }
      onCompletion();
      console.log(model,'API 请求成功');
    } catch (error) {
      console.error('API 请求失败:', error);
      onCompletion({ error: '请求失败，请稍后重试。' });
    }
  };

  fetchChatCompletion();

  return () => controller.abort();
}