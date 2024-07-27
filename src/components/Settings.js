// src/components/Settings.js
import React, { useState, useEffect } from 'react';
import SettingInput from './SettingInput';
import { models, settingsConfig } from 'config';
import { useSettings } from 'contexts/SettingsContext';

const Settings = () => {
	const { settings, updateSetting } = useSettings();
	const [maxTokens, setMaxTokens] = useState(4096);

	useEffect(() => {
		const selectedModel = models.find(model => model.value === settings.model);
		if (selectedModel) {
			setMaxTokens(selectedModel.maxTokens);
		}
	}, [settings.model]);

	return (
		<div>
			<h1 className="text-4xl text-slate-700 dark:text-yellow-100 font-bold mb-4">设置界面</h1>
			<div className="my-4">
				<p className="text-sm text-gray-600 dark:text-yellow-200">
					开源地址： <a href="https://github.com/nowscott/ChatWithMou" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">请点击</a>
				</p>
			</div>
			{settingsConfig.map(setting => {
				if (setting.type === 'select') {
					return (
						<div key={setting.label} className="mb-4">
							<label className="block mb-2 dark:text-yellow-50">{setting.label}:</label>
							<select
								className="w-full p-2 border rounded"
								value={settings[setting.stateKey]}
								onChange={(e) => updateSetting(setting.stateKey, e.target.value)}
							>
								{models.map(model => (
									<option key={model.value} value={model.value}>
										{model.value} {model.isFree && "(免费)"}
									</option>
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
							max={setting.max === 0 ? maxTokens : setting.max}
							step={setting.step}
						/>
					);
				}
			})}
		</div>
	);
};

export default Settings;