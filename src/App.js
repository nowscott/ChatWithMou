// App.js
import React from 'react';
import ChatPage from 'pages/chatpage';
import { ThemeProvider } from 'contexts/ThemeContext';

const App = () => {
    return (
        <ThemeProvider>
            <ChatPage />
        </ThemeProvider>
    );
};

export default App;