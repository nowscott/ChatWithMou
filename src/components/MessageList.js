import React, { useEffect, useRef, useCallback, useState } from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import copy from 'copy-to-clipboard';
import { HiOutlineDuplicate, HiCheckCircle } from 'react-icons/hi';

const MessageList = ({ messages }) => {
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
        p: ({ node, ...props }) => {
            if (node.children && node.children.some(child => child.tagName === 'code')) {
                return <>{props.children}</>;
            }
            return <p {...props} />;
        },
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const content = String(children).replace(/\n$/, '');
            const messageId = props['data-message-id'];
            return !inline && match ? (
                <div className="relative">
                    <SyntaxHighlighter
                        style={docco}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                    >
                        {content}
                    </SyntaxHighlighter>
                    <button
                        className="absolute top-2 right-2 text-xs text-blue-500"
                        onClick={() => handleCopy(content, messageId)}
                    >
                        {copied === messageId ? <HiCheckCircle className="h-4 w-4 text-green-500" /> : <HiOutlineDuplicate className="h-4 w-4" />}
                    </button>
                </div>
            ) : (
                <code className={className} {...props}>
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
                        <ReactMarkdown components={customRenderers} remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                    <div className="text-gray-500 text-sm">{moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
                    {message.totalTokens !== null && (
                        <div className="text-gray-500 text-sm">Token: {message.totalTokens}</div>
                    )}
                    <button
                        className="absolute bottom-2 right-2 text-xs text-blue-500"
                        onClick={() => handleCopy(message.content, message.mid)}
                    >
                        {copied === message.mid ? <HiCheckCircle className="h-4 w-4 text-green-500" /> : <HiOutlineDuplicate className="h-4 w-4" />}
                    </button>
                </div>
            ))}
            <div ref={messageEndRef}></div>
        </div>
    );
};

export default MessageList;