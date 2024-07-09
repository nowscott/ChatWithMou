// src/settingsConfig.js

export const models = [
    { value: 'Qwen/Qwen2-7B-Instruct', title: 'Qwen' },
    { value: 'Qwen/Qwen2-1.5B-Instruct', title: 'Qwen' },
    { value: 'Qwen/Qwen1.5-7B-Chat', title: 'Qwen' },
    { value: 'THUDM/glm-4-9b-chat', title: 'GLM' },
    { value: 'THUDM/chatglm3-6b', title: 'GLM' },
    { value: '01-ai/Yi-1.5-9B-Chat-16K', title: '「零一」' },
    { value: '01-ai/Yi-1.5-6B-Chat', title:'「零一」'}
];

export const settingsConfig = [
    { label: '模型', type: 'select', stateKey: 'model' },
    { label: '系统提示词', type: 'text', stateKey: 'systemPrompt' },
    { label: 'API 密钥', type: 'password', stateKey: 'apiKey' },
    { label: '最大 Tokens', type: 'range', min: 1, max: 4096, stateKey: 'maxTokens' },
    { label: '温度', type: 'range', min: 0, max: 1, step: 0.1, stateKey: 'temperature' },
    { label: 'Top P', type: 'range', min: 0, max: 1, step: 0.1, stateKey: 'topP' },
    { label: 'Top K', type: 'range', min: 0, max: 100, stateKey: 'topK' },
    { label: '频率惩罚', type: 'range', min: 0, max: 2, step: 0.1, stateKey: 'frequencyPenalty' }
];

export const initialSettings = {
    apiKey: '',
    systemPrompt: '',
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.7,
    topK: 50,
    frequencyPenalty: 0.5,
    model: 'Qwen/Qwen2-7B-Instruct'
};