import React from 'react';
import TestAPIKey from './TestAPIKey';

const SettingInput = ({ label, type = 'text', value, onChange, min, max, step}) => (
    <div className="mb-4">
        <label className="block mb-2">{label}:</label>
        {type === 'range' ? (
            <div className="flex items-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    className="flex-grow"
                    value={value}
                    onChange={onChange}
                />
                <span className="ml-2 w-12">{value}</span>
            </div>
        ) : type === 'text' ? (
            <textarea
                className="w-full p-2 border rounded h-16 overflow-auto"
                value={value}
                onChange={onChange}
                rows={2}
            />
        ) : (
            <div className="flex items-center">
                <input
                    type={type}
                    className="w-full p-2 border rounded"
                    value={value}
                    onChange={onChange}
                    style={type === 'password' ? { WebkitTextSecurity: 'disc' } : {}}
                    autoComplete="new-password"
                />
                <span className="ml-2 w-12 flex-col">
                    <TestAPIKey apiKey={value}/>
                </span>
            </div>
        )}
    </div>
);

export default SettingInput;