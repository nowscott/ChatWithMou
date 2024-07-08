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
        <div className="flex-0 w-full bg-slate-400 p-2">
            <div className="p-2 bg-white rounded-lg flex items-center relative max-w-screen-md w-full mx-auto">
                <div className="flex flex-grow items-center border-2 rounded border-slate-300 bg-stone-50">
                    <button
                        className="p-1 text-rose-500"
                        onClick={handleClear}
                    >
                        <HiOutlineTrash className="h-6 w-6" />
                    </button>
                    <textarea
                        className="bg-stone-50 font-serif w-full p-1 border-none outline-none resize-none overflow-auto whitespace-pre-wrap break-words disable-ring-shadow"
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
                        placeholder="输入你的提示词..."
                    />
                    <button
                        className="p-1 text-slate-500"
                        onClick={handleSend}
                    >
                        <HiOutlineAnnotation className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputPrompt;