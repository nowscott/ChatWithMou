import React from 'react';

const SettingInput = ({ label, type = 'text', value, onChange, min, max, step }) => (
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
                <span className="ml-2 w-16">{value}</span>
            </div>
        ) : (
            <input 
                type={type} 
                className="w-full p-2 border rounded" 
                value={value} 
                onChange={onChange}
                style={type === 'password' ? { WebkitTextSecurity: 'disc' } : {}}
            />
        )}
    </div>
);

export default SettingInput;