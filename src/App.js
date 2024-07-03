import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment'; // 导入 moment.js
import ReactMarkdown from 'react-markdown'; // 导入 react-markdown
import ChatAPI from './components/ChatAPI';
import InputPrompt from './components/InputPrompt';
import MessageHistory from './components/MessageHistory';

const MainComponent = () => {
    const { messages, addUserMessage, addAIMessage, updateMessage, clearMessages } = MessageHistory();
    const [submittedPrompt, setSubmittedPrompt] = useState(''); // 用于存储提交的prompt值
    const [aiMessageMid, setAiMessageMid] = useState(null);
    const messagesEndRef = useRef(null); // 引用消息列表的底部

    const handleContentUpdate = (newContent) => {
        updateMessage(aiMessageMid, prevMessage => ({
            content: (prevMessage.content || '') + newContent
        }));
    };

    const handleTokenUpdate = (newTotalTokens) => {
        updateMessage(aiMessageMid, {
            totalTokens: newTotalTokens
        });
    };

    const handleSend = (prompt) => {
        addUserMessage(prompt);
        const newAiMessageMid = addAIMessage();
        setAiMessageMid(newAiMessageMid);

        // 构建包含聊天记录的完整 prompt
        const chatHistory = messages.map(msg => `${msg.role === 'user' ? '你' : 'AI'}: ${msg.content}`).join('\n');
        const fullPrompt = `${chatHistory}\n你: ${prompt}`;

        setSubmittedPrompt(fullPrompt); // 触发ChatAPI组件更新
    };

    const handleClearMessages = () => {
        clearMessages();
    };

    // 在消息内容更新时自动滚动到页面底部
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow p-4 overflow-auto" style={{ paddingBottom: '100px' }}>
                <h1 className="text-2xl font-bold mb-4">Chat With Qwen</h1>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.mid} className="p-4 border rounded shadow-sm">
                            <div className="font-bold">
                                {message.role === 'user' ? '你' : 'AI'}:
                            </div>
                            <ReactMarkdown className="prose">{message.content}</ReactMarkdown>
                            <div className="text-gray-500 text-sm">{moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
                            {message.totalTokens !== null && (
                                <div className="text-sm text-gray-600">token：{message.totalTokens}</div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} /> {/* 底部引用 */}
                </div>
            </div>
            <InputPrompt onSend={handleSend} onClear={handleClearMessages} />
            {submittedPrompt && (
                <ChatAPI
                    prompt={submittedPrompt}
                    onContentUpdate={handleContentUpdate}
                    onTokenUpdate={handleTokenUpdate}
                />
            )}
        </div>
    );
};

export default MainComponent;