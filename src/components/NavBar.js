import { useState, useEffect } from 'react';
import { HiOutlineCog } from 'react-icons/hi';
import MessageExporter from './MessageExporter';

const NavBar = ({ targetRef, onSettingsClick }) => {
    const [title, setTitle] = useState('Chat With Mou');

    const toggleTitle = () => {
        setTitle((prevTitle) => (prevTitle === 'Chat With Mou' ? '对牛弹琴' : 'Chat With Mou'));
    };

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div className='flex-0'>
            <div className="flex bg-slate-400 text-stone-50 p-2 justify-between items-center">
                <h1 className="pl-2 text-nowrap text-2xl font-bold" onClick={toggleTitle}>
                    <span>{title}</span>
                </h1>
                <div className="flex items-center gap-4">
                    <button onClick={onSettingsClick}>
                        <HiOutlineCog size={24} />
                    </button>
                    <MessageExporter targetRef={targetRef} />
                </div>
            </div>
        </div>
    );
};

export default NavBar;