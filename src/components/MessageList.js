import React, { useEffect, useRef, useCallback, useState } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HiOutlineTrash, HiOutlineDuplicate, HiCheckCircle, HiExclamation } from 'react-icons/hi';
import CodeBlock from './CodeBlock';
import copy from 'copy-to-clipboard';

const MessageList = ({ messages, onDelete }) => {
    const messageEndRef = useRef(null);
    const containerRef = useRef(null);
    const [copied, setCopied] = useState(null);
    const [pendingDelete, setPendingDelete] = useState({});

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCopy = useCallback((content, messageId) => {
        const trimmedContent = content.replace(/^\n+/, ''); // 去除开头的空行
        copy(trimmedContent);
        setCopied(messageId);
        setTimeout(() => {
            setCopied(null);
        }, 5000);
    }, []);

    const handleDeleteClick = (messageId) => {
        if (pendingDelete[messageId]) {
            onDelete(messageId);
        } else {
            setPendingDelete({ ...pendingDelete, [messageId]: true });
            setTimeout(() => {
                setPendingDelete((prev) => {
                    const newState = { ...prev };
                    delete newState[messageId];
                    return newState;
                });
            }, 5000);
        }
    };

    const customRenderers = {
        p: ({ node, ...props }) => <p {...props} className="whitespace-pre-wrap text-justify" />,
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const content = String(children).replace(/^\n+/, '').replace(/\n+$/, ''); // 去除开头和结尾的空行
            return !inline && match ? (
                <CodeBlock language={match[1]} value={content} />
            ) : (
                <code className={`${className} whitespace-pre-wrap break-words`} {...props}>
                    {content}
                </code>
            );
        },
        ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-6" />,
        ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-6" />,
        li: ({ node, ...props }) => <li {...props} className="whitespace-normal break-words" />
    };

    return (
        <div ref={containerRef} className='flex-1 overflow-auto p-4'>
            {messages.map((message, index) => (
                <div
                    key={message.mid}
                    className={`font-light font-serif bg-white shadow-md rounded-lg py-2 px-4 relative max-w-screen-md w-full mx-auto ${index !== messages.length - 1 ? 'mb-4' : ''}`}
                >
                    <div>
                        <strong>{message.role === 'user' ? '你' : 'AI'}:</strong>
                        <ReactMarkdown
                            components={customRenderers}
                            remarkPlugins={[remarkGfm]}
                            className="break-words markdown-content whitespace-nowrap"
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                    <div className="text-gray-500 text-sm">{moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
                    {message.totalTokens !== null && (
                        <div className="text-gray-500 text-sm">Token: {message.totalTokens}</div>
                    )}
                    <div className="absolute bottom-2 right-2 flex space-x-2">
                        <button
                            className={`text-xs ${pendingDelete[message.mid] ? 'text-red-500' : 'text-green-700'}`}
                            onClick={() => handleDeleteClick(message.mid)}
                        >
                            {pendingDelete[message.mid] ? <HiExclamation className="h-4 w-4 text-red-500" /> : <HiOutlineTrash className="h-4 w-4" />}
                        </button>
                        <button
                            className="text-xs text-blue-500"
                            onClick={() => handleCopy(message.content, message.mid)}
                        >
                            {copied === message.mid ? <HiCheckCircle className="h-4 w-4 text-green-500" /> : <HiOutlineDuplicate className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            ))}
            <div ref={messageEndRef}></div>
        </div>
    );
};

export default MessageList;