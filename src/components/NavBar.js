import React from 'react';
import MessageExporter from './MessageExporter';
import { HiOutlineCog } from 'react-icons/hi';

const NavBar = ({ targetRef, onSettingsClick }) => {
    return (
        <div className='flex-0'>
            <div className="flex bg-slate-400 text-stone-50 p-2 justify-between items-center">
                <h1 className="pl-2 text-nowrap font-serif text-2xl font-bold">
                    <span>Chat With Mou</span>
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