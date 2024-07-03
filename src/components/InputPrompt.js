import React, { useState } from 'react';
import { HiOutlineTrash, HiOutlineAnnotation } from "react-icons/hi";

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

    const handleClear = () => {
        const confirmed = window.confirm('确定要清空消息记录吗？');
        if (confirmed) {
            onClear();
        }
    };

    return (
        <div className="w-full p-2 bg-white border-t border-gray-300 flex items-center">
            <div className="flex flex-grow items-center border rounded  mx-4">
                <button
                    className="p-1 text-red-500"
                    onClick={handleClear}
                >
                    <HiOutlineTrash className="h-6 w-6" />
                </button>
                <input
                    className="w-full px-2 py-1 border-none outline-none"
                    value={prompt}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    placeholder="输入你的提示词"
                />
                <button
                    className="p-1 text-blue-500"
                    onClick={handleSend}
                >
                    <HiOutlineAnnotation className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default InputPrompt;