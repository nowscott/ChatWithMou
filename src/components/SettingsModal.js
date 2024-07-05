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
            <div className="bg-white rounded-lg  p-4 relative max-w-screen-md w-full  m-4">
                <button onClick={onRequestClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <HiOutlineX />
                </button>
                <Settings
                    settings={settings}
                    onSettingsChange={onSettingsChange}
                />
            </div>
        </Modal>
    );
};

export default SettingsModal;