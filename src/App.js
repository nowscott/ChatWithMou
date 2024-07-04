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
        const newAiMessageId = addAIMessage();
        setAiMessageMid(newAiMessageId);
    
        const formatMessage = (msg) => `${msg.role === 'user' ? '你' : 'AI'}: ${msg.content}`;
        const chatHistory = messages.map(formatMessage).join('\n');
        const fullPrompt = `${chatHistory}\n你: ${prompt}`;
    
        setSubmittedPrompt(fullPrompt);
    };

    const handleModelChange = (model) => {
        setSelectedModel(model);
        localStorage.setItem('selectedModel', model);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-blue-50">
            <NavBar selectedModel={selectedModel} onModelChange={handleModelChange} />
            <div className="flex-1 overflow-y-auto mt-12 mb-12 flex flex-col-reverse"> 
                <div className="flex flex-col justify-end"> 
                    <MessageList messages={messages} onDelete={deleteMessage} />
                </div>
            </div>
            <div className="fixed bottom-0 w-full bg-blue-300 py-2 px-4 border-t border-white">
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