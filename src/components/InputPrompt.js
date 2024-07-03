import React, { useState } from 'react';

const InputPrompt = ({ onSend, onClear }) => {
    const [prompt, setPrompt] = useState('');
    const [isComposing, setIsComposing] = useState(false);

    const handleChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const handleKeyDown = (e) => {
        if (!isComposing && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 防止默认的换行行为
            handleSend();
        }
    };

    const handleSend = () => {
        if (prompt.trim() === '') return; // 如果提示为空，则不发送
        onSend(prompt);
        setPrompt(''); // 发送后清空输入框
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md flex items-center space-x-2">
            <input
                value={prompt}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder="输入你的提示词"
                className="flex-1 border rounded p-2"
            />
            <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">发送</button>
            <button onClick={onClear} className="bg-red-500 text-white px-4 py-2 rounded">清空消息记录</button>
        </div>
    );
};

export default InputPrompt;