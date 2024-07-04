import React, { useEffect, useState } from 'react';
import CaptureScreen from './MessageExporter';

const models = [
    { value: 'Qwen/Qwen2-7B-Instruct', title: 'Qwen' },
    { value: 'Qwen/Qwen2-1.5B-Instruct', title: 'Qwen' },
    { value: 'Qwen/Qwen1.5-7B-Chat', title: 'Qwen' },
    { value: 'THUDM/glm-4-9b-chat', title: 'GLM' },
    { value: 'THUDM/chatglm3-6b', title: 'GLM' },
    { value: '01-ai/Yi-1.5-9B-Chat-16K', title: '「零一」' }
];

const NavBar = ({ selectedModel, onModelChange, targetRef }) => {
    const [title, setTitle] = useState('Qwen');

    useEffect(() => {
        const savedModel = localStorage.getItem('selectedModel');
        if (savedModel) {
            onModelChange(savedModel);
        }
    }, [onModelChange]);

    useEffect(() => {
        const selected = models.find(model => model.value === selectedModel);
        if (selected) {
            setTitle(selected.title);
        }
        if (selectedModel) {
            localStorage.setItem('selectedModel', selectedModel);
        }
    }, [selectedModel]);

    return (
        <div className='flex-0'>
            <div className="flex bg-blue-300 text-white p-2 px-4 justify-between items-center top-0 left-0 right-0">
                <h1 className="text-nowrap font-serif text-2xl font-bold">
                    <span className="hidden sm:inline">Chat With </span>
                    {title}
                </h1>
                <select
                    className="bg-white font-serif text-black p-2 rounded"
                    value={selectedModel}
                    onChange={(event) => onModelChange(event.target.value)}
                >
                    {models.map(model => (
                        <option key={model.value} value={model.value}>{model.value}</option>
                    ))}
                </select>
                <CaptureScreen targetRef={targetRef} />
            </div>
        </div>
    );
};

export default NavBar;