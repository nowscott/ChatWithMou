import React from 'react';
import { saveAs } from 'file-saver';
import { HiOutlineDownload } from "react-icons/hi";
import MessageHistory from './MessageHistory'; // 假设你的MessageHistory组件在同一目录下

const convertMessagesToMarkdown = (messages, title) => {
    const header = `# ${title}\n\n`;
    const body = messages.map(message => {
        const role = message.role === 'user' ? '用户' : 'AI';
        const date = new Date(message.timestamp).toLocaleString();
        return `### ${role}\n\n${message.content}\n\n*时间: ${date}*\n`;
    }).join('\n');
    return header + body;
};

const exportMarkdown = (markdown, filename) => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, filename);
};

const MessageExporter = () => {
    const { messages } = MessageHistory();

    const handleExport = () => {
        const date = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0]; // 获取当前日期，格式为 YYYY-MM-DD_HH-MM-SS
        const title = `chat-history-${date}`;
        const md = convertMessagesToMarkdown(messages, title);
        const filename = `${title}.md`;
        exportMarkdown(md, filename);
    };

    return (
        <button onClick={handleExport} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <HiOutlineDownload size={24} />
        </button>
    );
};

export default MessageExporter;