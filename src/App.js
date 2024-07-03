import React, { useState } from 'react';
import ChatAPI from './components/ChatAPI';
import InputPrompt from './components/InputPrompt';
import MessageHistory from './components/MessageHistory';
import MessageList from './components/MessageList';

const MainComponent = () => {
    const { messages, addUserMessage, addAIMessage, updateMessage, clearMessages } = MessageHistory();
    const [submittedPrompt, setSubmittedPrompt] = useState(''); 
    const [aiMessageMid, setAiMessageMid] = useState(null);

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

        const chatHistory = messages.map(msg => `${msg.role === 'user' ? '你' : 'AI'}: ${msg.content}`).join('\n');
        const fullPrompt = `${chatHistory}\n你: ${prompt}`;

        setSubmittedPrompt(fullPrompt);
    };

    return (
        <div className="flex flex-col h-screen">
            <MessageList messages={messages} />
            <div className="bg-gray-100 p-4 border-t border-gray-300">
                <InputPrompt onSend={handleSend} onClear={clearMessages} />
            </div>
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