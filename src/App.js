import React, { useState } from 'react';
import ChatAPI from './components/ChatAPI';
import InputPrompt from './components/InputPrompt';
import MessageHistory from './components/MessageHistory';
import MessageList from './components/MessageList';
import NavBar from './components/NavBar';

const App = () => {
    const { messages, addUserMessage, addAIMessage, updateMessage, clearMessages, deleteMessage } = MessageHistory();
    const [submittedPrompt, setSubmittedPrompt] = useState('');
    const [aiMessageMid, setAiMessageMid] = useState(null);
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('selectedModel') || 'Qwen/Qwen2-7B-Instruct');

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

    const handleModelChange = (model) => {
        setSelectedModel(model);
        localStorage.setItem('selectedModel', model);
    };

    return (
        <div className="flex flex-col h-screen">
            <NavBar selectedModel={selectedModel} onModelChange={handleModelChange} />
            <MessageList messages={messages} onDelete={deleteMessage} />
            <div className="bg-blue-100 p-4 border-t border-white">
                <InputPrompt onSend={handleSend} onClear={clearMessages} />
            </div>
            {submittedPrompt && (
                <ChatAPI
                    prompt={submittedPrompt}
                    onContentUpdate={handleContentUpdate}
                    onTokenUpdate={handleTokenUpdate}
                    model={selectedModel}
                />
            )}
        </div>
    );
};

export default App;