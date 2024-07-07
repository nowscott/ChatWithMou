import React from 'react';
import SettingInput from './SettingInput';
import { models, settingsConfig } from '../settingsConfig';
import useSettings from '../hooks/useSettings';

const Settings = ({ initialSettings }) => {
    const [settings, updateSetting] = useSettings(initialSettings);

    return (
        <div className='font-serif'>
            <h1 className="text-4xl text-slate-700 font-bold mb-4">设置界面</h1>
            {settingsConfig.map(setting => {
                if (setting.type === 'select') {
                    return (
                        <div key={setting.label} className="mb-4">
                            <label className="block mb-2">{setting.label}:</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={settings[setting.stateKey]}
                                onChange={(e) => updateSetting(setting.stateKey, e.target.value)}
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
                            label={setting.label}
                            type={setting.type}
                            value={settings[setting.stateKey]}
                            onChange={(e) => updateSetting(setting.stateKey, setting.type === 'range' ? parseFloat(e.target.value) : e.target.value)}
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