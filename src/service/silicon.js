import ky from 'ky';
import { handleStreamResponse } from 'utils/streamUtils'; 

const apiKey = process.env.REACT_APP_SILICON_API_KEY;
if (!apiKey) {
  throw new Error("Silicon API Key 缺失");
}

export const sendSiliconMessage = ({
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
}) => {
  const controller = new AbortController();
  const { signal } = controller;

  const options = {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    json: {
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
    },
    signal,
  };

  ky.post('https://api.siliconflow.cn/v1/chat/completions', options)
    .then(response => {
      handleStreamResponse(response.body.getReader(), onContentUpdate, onTokenUpdate, onCompletion);
    })
    .catch(err => {
      onContentUpdate('在当前网络环境下该模型服务异常，请检查网络或切换其他模型');
      console.error('API 请求失败:', err);
    });

  return () => controller.abort();
};