import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { HiOutlineDuplicate, HiCheckCircle } from 'react-icons/hi';
import copy from 'copy-to-clipboard';
import { useState, useCallback } from 'react';

const CodeBlock = ({ language, value, messageId }) => {
    const [copied, setCopied] = useState(null);

    const handleCopy = useCallback(() => {
        copy(value);
        setCopied(messageId);
        setTimeout(() => {
            setCopied(null);
        }, 5000);
    }, [value, messageId]);

    return (
        <div className="relative">
            <SyntaxHighlighter
                style={atomOneDark}
                language={language}
                PreTag="div"
                className="text-sm rounded"
            >
                {value}
            </SyntaxHighlighter>
            <button
                className="absolute top-2 right-2 text-xs text-blue-500"
                onClick={handleCopy}
            >
                {copied === messageId ? <HiCheckCircle className="h-4 w-4 text-green-500" /> : <HiOutlineDuplicate className="h-4 w-4" />}
            </button>
        </div>
    );
};

export default CodeBlock;