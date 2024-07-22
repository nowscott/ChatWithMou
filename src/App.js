// App.js
import React from 'react';
import ChatPage from 'pages/ChatPage';
import { ThemeProvider } from 'contexts/ThemeContext';
import { SettingsProvider } from 'contexts/SettingsContext';

const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ChatPage />
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;