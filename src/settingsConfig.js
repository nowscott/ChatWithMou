// src/settingsConfig.js

export const models = [
  { value: 'Qwen/Qwen2-7B-Instruct', maxTokens: 4096, isFree: true, source: 'silicon' },
  { value: 'Qwen/Qwen2-1.5B-Instruct', maxTokens: 4096, isFree: true, source: 'silicon' },
  { value: 'Qwen/Qwen1.5-7B-Chat', maxTokens: 4096, isFree: true, source: 'silicon' },
  { value: 'THUDM/glm-4-9b-chat', maxTokens: 4096, isFree: true, source: 'silicon' },
  { value: 'THUDM/chatglm3-6b', maxTokens: 4096, isFree: true, source: 'silicon' },
  { value: '01-ai/Yi-1.5-9B-Chat-16K', maxTokens: 4096, isFree: true, source: 'silicon' },
  { value: '01-ai/Yi-1.5-6B-Chat', maxTokens: 2048, isFree: true, source: 'silicon' },
  { value: 'llama-3.1-70b-versatile', maxTokens: 8192, isFree: true, source: 'groq' },
  { value: 'llama-3.1-8b-instant', maxTokens: 8192  , isFree: true, source: 'groq' },
  { value: 'llama3-70b-8192', maxTokens: 8192, isFree: true, source: 'groq' },
  // { value: 'llama3-groq-70b-8192-tool-use-preview', maxTokens: 8192, isFree: true, source: 'groq' },
  { value: 'llama3-8b-8192', maxTokens: 8192, isFree: true, source: 'groq' },
  // { value: 'llama3-groq-8b-8192-tool-use-preview', maxTokens: 8192, isFree: true, source: 'groq' },
  { value: 'mixtral-8x7b-32768', maxTokens: 32768, isFree: true, source: 'groq' },
  { value: 'gemma2-9b-it', maxTokens: 8192, isFree: true, source: 'groq' },
  { value: 'gemma-7b-it', maxTokens: 8192, isFree: true, source: 'groq' },
  // { value: 'Qwen/Qwen2-72B-Instruct', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'Qwen/Qwen2-57B-A14B-Instruct', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'Qwen/Qwen1.5-110B-Chat', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'Qwen/Qwen1.5-32B-Chat', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: '01-ai/Yi-1.5-34B-Chat-16K', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'deepseek-ai/DeepSeek-V2-Chat', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'deepseek-ai/DeepSeek-Coder-V2-Instruct', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'deepseek-ai/deepseek-llm-67b-chat', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'mistralai/Mixtral-8x7B-Instruct-v0.1', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'mistralai/Mistral-7B-Instruct-v0.2', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'meta-llama/Meta-Llama-3-8B-Instruct', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'google/gemma-2-27b', maxTokens: 4096, isFree: false, source: 'silicon' },
  // { value: 'google/gemma-2-9b', maxTokens: 4096, isFree: false, source: 'silicon' },
];

export const settingsConfig = [
  { label: '模型', type: 'select', stateKey: 'model' },
  { label: '系统提示词', type: 'text', stateKey: 'systemPrompt' },
  // { label: 'API 密钥', type: 'password', stateKey: 'apiKey' },
  { label: '最大 Tokens', type: 'range', min: 1, max: 0, stateKey: 'maxTokens' },
  { label: '温度', type: 'range', min: 0, max: 1, step: 0.1, stateKey: 'temperature' },
  { label: 'Top P', type: 'range', min: 0, max: 1, step: 0.1, stateKey: 'topP' },
  // { label: 'Top K', type: 'range', min: 0, max: 100, stateKey: 'topK' },
  // { label: '频率惩罚', type: 'range', min: 0, max: 2, step: 0.1, stateKey: 'frequencyPenalty' }
];

export const initialSettings = {
  apiKey: '',
  systemPrompt: '',
  maxTokens: 512,
  temperature: 0.7,
  topP: 0.7,
  topK: 50,
  frequencyPenalty: 0.5,
  model: 'Qwen/Qwen2-7B-Instruct',
  source: 'silicon',
};