// src/pages/ChatPage.js
import React, { useState, useCallback, useEffect } from 'react';
import ChatAPI from 'components/ChatAPI';
import NavBar from 'components/layout/NavBar';
import MessageList from 'components/layout/MessageList';
import InputPrompt from 'components/layout/InputPrompt';
import MessageHistory from 'components/MessageHistory';
import SettingsModal from 'components/SettingsModal';
import { useSettings } from 'contexts/SettingsContext';

const ChatPage = () => {
  const { settings, updateSetting } = useSettings();
  const { messages, addUserMessage, addAIMessage, updateMessage, clearMessages, deleteMessage } = MessageHistory();
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [aiMessageMid, setAiMessageMid] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMessageComplete, setIsMessageComplete] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  useEffect(() => {
    setShouldSubmit(false);
  }, [settings]);

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
    const formatMessage = (msg) => `${msg.role === 'user' ? 'user' : 'AI'}: ${msg.content}`;
    const chatHistory = messages.map(formatMessage).join('\n');
    const fullPrompt = `chatHistory: ${chatHistory}\nuser: ${prompt}`;
    setIsMessageComplete(false);
    setSubmittedPrompt(fullPrompt);
    setShouldSubmit(true);
    const textarea = document.querySelector('textarea');
    if (textarea) {
        textarea.style.height = 'auto';
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleCompletion = useCallback(() => {
    setIsMessageComplete(true);
    setShouldSubmit(false);
  }, []);

  return (
    <div className="flex flex-col h-svh justify-between overflow-hidden bg-stone-200 dark:bg-stone-800">
      <NavBar onSettingsClick={handleSettingsClick} />
      <MessageList messages={messages} onDelete={deleteMessage} />
      <InputPrompt onSend={handleSend} onClear={clearMessages} />
      {submittedPrompt && shouldSubmit && !isSettingsOpen && (
        <ChatAPI
          source={settings.source}
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
        onRequestClose={handleCloseSettings}
        settings={settings}
        updateSetting={updateSetting}
      />
    </div>
  );
};

export default ChatPage;