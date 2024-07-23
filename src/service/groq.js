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

  if (!prompt.trim()) {
    console.error("提示信息为空，未发送请求");
    return () => { };
  }

  const fetchChatCompletion = async () => {
    try {
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

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || '';
        onContentUpdate(content);
        if (chunk.x_groq && chunk.x_groq.usage) {
          onTokenUpdate(chunk.x_groq.usage.total_tokens);
        }
      }
      onCompletion();
    } catch (error) {
      onContentUpdate('在当前网络环境下该模型服务异常，请检查网络或切换其他模型');
      onCompletion({ error: '请求失败，请稍后重试。' });
    }
  };

  fetchChatCompletion();

  return () => controller.abort();
}