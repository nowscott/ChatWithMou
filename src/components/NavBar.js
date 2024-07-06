import React from 'react';
import MessageExporter from './MessageExporter';
import { HiOutlineCog } from 'react-icons/hi';

const NavBar = ({ targetRef, onSettingsClick }) => {
    return (
        <div className='flex-0'>
            <div className="flex bg-blue-300 text-white p-2 justify-between items-center top-0 left-0 right-0">
                <h1 className="text-nowrap font-serif text-2xl font-bold">
                    <span>Chat With Mou</span>
                </h1>
                <div className="flex items-center gap-2">
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