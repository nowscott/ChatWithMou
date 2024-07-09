// src/hooks/useSettings.js
import { useState } from 'react';
import { models, initialSettings } from '../settingsConfig';

const useSettings = () => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('settings');
        return savedSettings ? JSON.parse(savedSettings) : initialSettings;
    });

    const updateSetting = (stateKey, value) => {
        let newSettings = { ...settings, [stateKey]: value };

        if (stateKey === 'model') {
            const selectedModel = models.find(model => model.value === value);
            if (selectedModel && settings.maxTokens > selectedModel.maxTokens) {
                console.warn(`当前 maxTokens:${settings.maxTokens}超过了${value}的最大值${selectedModel.maxTokens}，将其设置为${value}的最大值。`);
                newSettings.maxTokens = selectedModel.maxTokens;
            }
            const apiKeyStatus = selectedModel && !selectedModel.isFree
            ? localStorage.getItem('apiKeyStatus')
            : 'true';
            if (apiKeyStatus === 'false') {
                alert("当前api密钥不可用，不能使用付费模型");
                newSettings.model = initialSettings.model;
            }
        }

        if (stateKey === 'apiKey') {
            const currentModel = models.find(model => model.value === settings.model);
            const apiKeyStatus = currentModel && !currentModel.isFree
                ? localStorage.getItem('apiKeyStatus')
                : 'false';
            if (apiKeyStatus === 'true') {
                alert("当前api密钥不可用，不能使用付费模型");
                newSettings.model = initialSettings.model;
            }
        }


        setSettings(newSettings);
        localStorage.setItem('settings', JSON.stringify(newSettings));
    };

    return [settings, updateSetting];
};

export default useSettings;