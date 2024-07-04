import React, { useState, useEffect } from 'react';
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

    // 动态调整文本区域高度
    useEffect(() => {
        const textarea = document.querySelector('textarea');
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [prompt]);

    return (
        <div className="w-full p-2 px-4 bg-white rounded flex items-center max-w-screen-lg lg:w-3/5 mx-auto"> {/* 使用 Tailwind CSS 类 */}
            <div className="flex flex-grow items-center border rounded border-gray-300 bg-white">
                <button
                    className="p-1 text-red-500"
                    onClick={handleClear}
                >
                    <HiOutlineTrash className="h-6 w-6" />
                </button>
                <textarea
                    className="text-sm font-serif w-full px-2 py-1 border-none outline-none resize-none overflow-auto whitespace-pre-wrap break-words"
                    style={{ maxHeight: '10rem', minHeight: '1rem' }}
                    rows="1"
                    value={prompt}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
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