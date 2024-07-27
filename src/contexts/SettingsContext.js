import React, { createContext, useContext, useState } from 'react';
import { models, initialSettings } from 'config';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('settings');
    return savedSettings ? JSON.parse(savedSettings) : initialSettings;
  });

  const updateSetting = (stateKey, value) => {
    let newSettings = { ...settings, [stateKey]: value };

    if (stateKey === 'model') {
      const selectedModel = models.find(model => model.value === value);
      if (selectedModel) {
        if (selectedModel.source) {
          newSettings.source = selectedModel.source;
        }
        if (selectedModel.maxTokens) {
          if (settings.maxTokens > selectedModel.maxTokens) {
            newSettings.maxTokens = selectedModel.maxTokens;
          }
        }
      }
    }

    setSettings(newSettings);
    localStorage.setItem('settings', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};