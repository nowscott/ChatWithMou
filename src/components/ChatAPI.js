import { useEffect } from 'react';
import { sendSiliconMessage } from 'service/silicon';
import { sendGroqMessage } from 'service/groq';

const systemPrompt0 = `
1. 每当用户提供对话记录时，优先使用提供的对话记录进行回答。
2. 如果用户询问“我说过什么”或类似问题，检查提供的对话记录，并根据记录内容进行回答。
3. 不需要提供类似“AI:”的前缀！！！
`;

const ChatAPI = ({
    source,
    prompt,
    onContentUpdate,
    onTokenUpdate,
    onCompletion,
    model,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    systemPrompt,
}) => {
    const fullSystemPrompt = `${systemPrompt0}\n${systemPrompt}`;

    useEffect(() => {
        if (!prompt) {
            console.error('Prompt 缺失');
            return;
        }
        const onMessageCompletion = (result) => {
            if (result && result.error) {
                console.error(result.error);
            }
            onCompletion && onCompletion(result);
        };

        const options = {
            prompt,
            model,
            maxTokens,
            temperature,
            topP,
            topK,
            frequencyPenalty,
            systemPrompt: fullSystemPrompt,
            onContentUpdate,
            onTokenUpdate,
            onCompletion: onMessageCompletion,
        };

        let abortFunction;
        if (source === 'silicon') {
            abortFunction = sendSiliconMessage(options);
        } else if (source === 'groq') {
            abortFunction = sendGroqMessage(options);
        } else {
            console.error('未知的 source 参数');
            return;
        }

        return () => {
            if (abortFunction) abortFunction();
        };
    }, [
        source,
        prompt,
        model,
        maxTokens,
        temperature,
        topP,
        topK,
        frequencyPenalty,
        fullSystemPrompt,
        onContentUpdate,
        onTokenUpdate,
        onCompletion,
    ]);

    return null;
};

export default ChatAPI;