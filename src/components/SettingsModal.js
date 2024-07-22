// src/components/SettingsModal.js
import React from 'react';
import Modal from 'react-modal';
import SettingsPage from '../pages/SettingsPage';

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
			<SettingsPage
				onRequestClose={onRequestClose}
				settings={settings}
				onSettingsChange={onSettingsChange}
			/>
		</Modal>
	);
};

export default SettingsModal;