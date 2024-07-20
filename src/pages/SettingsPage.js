// src/pages/SettingsPage.js
import React from 'react';
import Settings from '../components/Settings';
import { HiOutlineX } from "react-icons/hi";

const SettingsPage = ({ onRequestClose, settings, onSettingsChange }) => {
    return (
        <div className="flex flex-col h-full justify-center items-center relative max-w-screen-md w-full p-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 overflow-auto w-full">
                <div className="flex justify-end">
                    <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
                        <HiOutlineX />
                    </button>
                </div>
                <Settings
                    initialSettings={settings}
                    onSettingsChange={onSettingsChange}
                />
            </div>
        </div>
    );
};

export default SettingsPage;