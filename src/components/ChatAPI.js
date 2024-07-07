import { useEffect } from 'react';
import useChatAPI from 'hooks/useChatAPI'; // 确保路径正确

const systemPrompt0 = `
1. 每当用户提供对话记录时，优先使用提供的对话记录进行回答。
2. 如果用户询问“我说过什么”或类似问题，检查提供的对话记录，并根据记录内容进行回答。
3. 不需要提供类似“AI:”的前缀！！！
`;

const ChatAPI = ({
    prompt,
    onContentUpdate,
    onTokenUpdate,
    onCompletion,
    model,
    apiKey,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    systemPrompt,
}) => {
    const envApiKey = process.env.REACT_APP_API_KEY;
    const fullSystemPrompt = `${systemPrompt0}\n${systemPrompt}`;
    const { sendMessage } = useChatAPI({
        prompt,
        model,
        apiKey: apiKey || envApiKey,
        maxTokens,
        temperature,
        topP,
        topK,
        frequencyPenalty,
        systemPrompt: fullSystemPrompt,
        onContentUpdate,
        onTokenUpdate,
        onCompletion,
    });
    useEffect(() => {
        sendMessage();
    }, [prompt, sendMessage]);
    return null;
};

export default ChatAPI;