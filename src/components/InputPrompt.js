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
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (prompt.trim() === '') return;
        onSend(prompt);
        setPrompt('');
    };

    return (
        <div className="w-full p-4 bg-white border-t border-gray-300">
            <div className="flex flex-col md:flex-row md:items-center w-full">
                <input
                    className="w-full px-4 py-2 border rounded mb-2 md:mb-0 md:mr-2"
                    value={prompt}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    placeholder="输入你的提示词"
                />
                <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded mb-2 md:mb-0 md:mr-2 whitespace-nowrap"
                        onClick={handleSend}
                    >
                        发送
                    </button>
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded whitespace-nowrap"
                        onClick={onClear}
                    >
                        清空消息记录
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputPrompt;