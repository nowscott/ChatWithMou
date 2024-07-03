import React, { useEffect, useRef, useCallback, useState } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks'; // 引入 remark-breaks 插件
import { HiOutlineTrash, HiOutlineDuplicate, HiCheckCircle } from 'react-icons/hi';
import CodeBlock from './CodeBlock';
import copy from 'copy-to-clipboard';

const MessageList = ({ messages, onDelete }) => {
    const messageEndRef = useRef(null);
    const [copied, setCopied] = useState(null);

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCopy = useCallback((content, messageId) => {
        copy(content);
        setCopied(messageId);
        setTimeout(() => {
            setCopied(null);
        }, 5000);
    }, []);

    const customRenderers = {
        p: ({ node, ...props }) => <p {...props} />,
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const content = String(children).replace(/\n$/, '');
            return !inline && match ? (
                <CodeBlock language={match[1]} value={content} />
            ) : (
                <code className={`${className} whitespace-pre-wrap break-words`} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className="flex-1 overflow-auto p-4">
            {messages.map((message) => (
                <div key={message.mid} className="bg-white shadow-md rounded-lg p-4 m-4 relative">
                    <div>
                        <strong>{message.role === 'user' ? '你' : 'AI'}:</strong>
                        <ReactMarkdown 
                            components={customRenderers} 
                            remarkPlugins={[remarkGfm, remarkBreaks]} // 使用 remark-breaks 插件
                            className="whitespace-pre-wrap break-words"
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
                            className="text-xs text-red-500"
                            onClick={() => onDelete(message.mid)}
                        >
                            <HiOutlineTrash className="h-4 w-4" />
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