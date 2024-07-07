// src/hooks/useSettings.js
import { useState} from 'react';

const useSettings = (initialSettings) => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('settings');
        return savedSettings ? JSON.parse(savedSettings) : initialSettings;
    });

    const updateSetting = (stateKey, value) => {
        const newSettings = {
            ...settings,
            [stateKey]: value,
        };
        setSettings(newSettings);
        localStorage.setItem('settings', JSON.stringify(newSettings));
    };

    return [settings, updateSetting];
};

export default useSettings;