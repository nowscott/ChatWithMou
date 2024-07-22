import { useEffect } from 'react';
import { sendSiliconMessage } from 'service/silicon';
import { sendGroqMessage } from 'service/groq';

// 默认的系统提示词，可以注释掉或者删除
let systemPrompt0 = '';
// systemPrompt0 = `
// 1. 每当用户提供对话记录时，优先使用提供的对话记录进行回答。
// 2. 如果用户询问“我说过什么”或类似问题，检查提供的对话记录，并根据记录内容进行回答。
// 3. 不需要提供类似“AI:”的前缀！！！
// `;

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
	systemPrompt, // 可以为空
}) => {
	// 使用自定义系统提示，如果提供了的话
	const fullSystemPrompt = systemPrompt ? `${systemPrompt0}\n${systemPrompt}` : '';

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