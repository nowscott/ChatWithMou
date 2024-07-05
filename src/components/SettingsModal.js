import React from 'react';
import Modal from 'react-modal';
import Settings from './Settings';
import { HiOutlineX } from "react-icons/hi";

Modal.setAppElement('#root');

const SettingsModal = ({ isOpen, onRequestClose, settings, onSettingsChange }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Settings Modal"
            className="fixed inset-0 flex items-center justify-center z-50"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
            <div className="flex flex-col h-full justify-center items-center relative max-w-screen-md w-full p-4">
                <div className="bg-white rounded-lg p-4 overflow-auto w-full">
                    <div className="flex justify-end">
                        <button onClick={onRequestClose} className="text-gray-500 hover:text-gray-700">
                            <HiOutlineX />
                        </button>
                    </div>
                    <Settings
                        settings={settings}
                        onSettingsChange={onSettingsChange}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;