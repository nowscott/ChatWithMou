import React, { useState, useCallback } from 'react';
import ChatAPI from './components/ChatAPI';
import InputPrompt from './components/InputPrompt';
import MessageHistory from './components/MessageHistory';
import MessageList from './components/MessageList';
import NavBar from './components/NavBar';
import SettingsModal from './components/SettingsModal';

const App = () => {
    const { messages, addUserMessage, addAIMessage, updateMessage, clearMessages, deleteMessage } = MessageHistory();
    const [submittedPrompt, setSubmittedPrompt] = useState('');
    const [aiMessageMid, setAiMessageMid] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMessageComplete, setIsMessageComplete] = useState(false);
    const settings = JSON.parse(localStorage.getItem('settings'))

    const handleContentUpdate = useCallback((newContent) => {
        if (!isMessageComplete) {
            updateMessage(aiMessageMid, prevMessage => ({
                content: (prevMessage.content || '') + newContent
            }));
        }
    }, [aiMessageMid, updateMessage, isMessageComplete]);

    const handleTokenUpdate = useCallback((newTotalTokens) => {
        if (!isMessageComplete) {
            updateMessage(aiMessageMid, {
                totalTokens: newTotalTokens
            });
        }
    }, [aiMessageMid, updateMessage, isMessageComplete]);

    const handleSend = (prompt) => {
        addUserMessage(prompt);
        const newAiMessageId = addAIMessage();
        setAiMessageMid(newAiMessageId);
        const formatMessage = (msg) => `${msg.role === 'user' ? '你' : 'AI'}: ${msg.content}`;
        const chatHistory = messages.map(formatMessage).join('\n');
        const fullPrompt = `${chatHistory}\n你: ${prompt}`;
        setIsMessageComplete(false);
        setSubmittedPrompt(fullPrompt);
    };

    const handleSettingsClick = () => {
        setIsSettingsOpen(true);
    };

    const handleCloseSettings = (newSettings) => { 
        setIsSettingsOpen(false);
    };

    const handleCompletion = useCallback(() => {
        setIsMessageComplete(true);
    }, []);

    return (
        <div className="flex flex-col h-svh justify-between overflow-hidden bg-stone-200">
            <NavBar onSettingsClick={handleSettingsClick} />
            <MessageList messages={messages} onDelete={deleteMessage} />
            <InputPrompt onSend={handleSend} onClear={clearMessages} />
            {submittedPrompt && (
                <ChatAPI
                    prompt={submittedPrompt}
                    systemPrompt={settings.systemPrompt}
                    onContentUpdate={handleContentUpdate}
                    onTokenUpdate={handleTokenUpdate}
                    model={settings.model}
                    apiKey={settings.apiKey}
                    maxTokens={settings.maxTokens}
                    temperature={settings.temperature}
                    topP={settings.topP}
                    topK={settings.topK}
                    frequencyPenalty={settings.frequencyPenalty}
                    onCompletion={handleCompletion}
                />
            )}
            <SettingsModal
                isOpen={isSettingsOpen}
                onRequestClose={() => handleCloseSettings(settings)} // 确保 newSettings 正确传递
                settings={settings}
            />
        </div>
    );
};

export default App;