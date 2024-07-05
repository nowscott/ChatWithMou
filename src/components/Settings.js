import React from 'react';
import SettingInput from './SettingInput';

const models = [
    { value: 'Qwen/Qwen2-7B-Instruct', title: 'Qwen' },
    { value: 'Qwen/Qwen2-1.5B-Instruct', title: 'Qwen' },
    { value: 'Qwen/Qwen1.5-7B-Chat', title: 'Qwen' },
    { value: 'THUDM/glm-4-9b-chat', title: 'GLM' },
    { value: 'THUDM/chatglm3-6b', title: 'GLM' },
    { value: '01-ai/Yi-1.5-9B-Chat-16K', title: '「零一」' }
];

const settingsConfig = [
    { label: '模型', type: 'select', stateKey: 'model' },
    { label: 'API 密钥', type: 'password', stateKey: 'apiKey' },
    { label: '最大 Tokens', type: 'range', min: 1, max: 4096, stateKey: 'maxTokens' },
    { label: '温度', type: 'range', min: 0, max: 1, step: 0.1, stateKey: 'temperature' },
    { label: 'Top P', type: 'range', min: 0, max: 1, step: 0.1, stateKey: 'topP' },
    { label: 'Top K', type: 'range', min: 0, max: 100, stateKey: 'topK' },
    { label: '频率惩罚', type: 'range', min: 0, max: 2, step: 0.1, stateKey: 'frequencyPenalty' }
];

const Settings = ({ settings, onSettingsChange }) => {
    const handleChange = (stateKey, value) => {
        const newSettings = {
            ...settings,
            [stateKey]: value
        };
        onSettingsChange(newSettings);
        localStorage.setItem('settings', JSON.stringify(newSettings));
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">设置界面</h1>
            {settingsConfig.map(setting => {
                if (setting.type === 'select') {
                    return (
                        <div key={setting.label} className="mb-4">
                            <label className="block mb-2">{setting.label}:</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={settings[setting.stateKey]}
                                onChange={(e) => handleChange(setting.stateKey, e.target.value)}
                            >
                                {models.map(model => (
                                    <option key={model.value} value={model.value}>{model.value}</option>
                                ))}
                            </select>
                        </div>
                    );
                } else {
                    return (
                        <SettingInput
                            key={setting.label}
                            label={`${setting.label}`}
                            type={setting.type}
                            value={settings[setting.stateKey]}
                            onChange={e => handleChange(setting.stateKey, setting.type === 'range' ? parseFloat(e.target.value) : e.target.value)}
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                        />
                    );
                }
            })}
        </div>
    );
};

export default Settings;