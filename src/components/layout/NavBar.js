import { useState, useEffect, useContext } from 'react';
import { HiOutlineCog, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import MessageExporter from '../MessageExporter';
import { ThemeContext } from 'contexts/ThemeContext';

const NavBar = ({ targetRef, onSettingsClick }) => {
	const [title, setTitle] = useState('Chat With Mou');
	const { darkMode, setDarkMode } = useContext(ThemeContext);

	const toggleTitle = () => {
		setTitle((prevTitle) => (prevTitle === 'Chat With Mou' ? '對🐮彈琴' : 'Chat With Mou'));
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	useEffect(() => {
		document.title = title;
	}, [title]);

	return (
		<div className='flex-0'>
			<div className="flex bg-slate-400 text-stone-50 dark:bg-slate-900 dark:text-yellow-50 p-2 justify-between items-center">
				<h1 className="pl-2 text-nowrap text-2xl font-bold" onClick={toggleTitle}>
					<span>{title}</span>
				</h1>
				<div className="flex items-center gap-4">
					<MessageExporter targetRef={targetRef} />
					<button onClick={onSettingsClick}>
						<HiOutlineCog size={24} />
					</button>
					<button onClick={toggleDarkMode}>
						{darkMode ? <HiOutlineSun size={24} /> : <HiOutlineMoon size={24} />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default NavBar;