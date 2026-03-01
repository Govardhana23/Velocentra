import React, { useState } from 'react';

const TAB_ICONS = { hr: '📋', manager: '💼', colleague: '🤝' };
const TAB_LABELS = { hr: 'HR Style', manager: 'Manager Style', colleague: 'Colleague Style' };

export default function ReplyGeneratorPanel({ replies, selectedMessage }) {
    const [activeTab, setActiveTab] = useState('hr');

    if (!replies || !selectedMessage) {
        return (
            <div className="reply-panel glass-card">
                <div className="section-title">
                    <span className="icon">✉️</span>
                    Smart Reply Generator
                </div>
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <p>Select a message to generate role-aware replies</p>
                </div>
            </div>
        );
    }

    const currentReply = replies[activeTab];

    const getAssertColor = () => {
        if (currentReply.profile.assertiveness === 'High') return 'var(--accent-orange)';
        if (currentReply.profile.assertiveness === 'Measured') return 'var(--accent-cyan)';
        return 'var(--accent-green)';
    };

    const copyToClipboard = () => {
        navigator.clipboard?.writeText(currentReply.text);
    };

    return (
        <div className="reply-panel glass-card">
            <div className="section-title">
                <span className="icon">✉️</span>
                Smart Reply Generator
            </div>

            <div className="reply-tabs">
                {Object.entries(TAB_LABELS).map(([key, label]) => (
                    <button
                        key={key}
                        className={`reply-tab ${activeTab === key ? 'active' : ''}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {TAB_ICONS[key]} {label}
                    </button>
                ))}
            </div>

            <div className="reply-meta">
                <div className="reply-meta-item">
                    <span className="meta-label">Tone:</span>
                    {currentReply.profile.tone}
                </div>
                <div className="reply-meta-item">
                    <span className="meta-label">Length:</span>
                    {currentReply.wordCount} words
                </div>
                <div className="reply-meta-item">
                    <span className="meta-label">Assertiveness:</span>
                    <span style={{ color: getAssertColor(), fontWeight: 600 }}>
                        {currentReply.profile.assertiveness}
                    </span>
                </div>
                <div className="reply-meta-item">
                    <span className="meta-label">Formality:</span>
                    {(currentReply.profile.formality * 100).toFixed(0)}%
                </div>
            </div>

            <div className="reply-content">
                {currentReply.text}
            </div>

            <div className="reply-actions">
                <button className="btn btn-primary btn-sm" onClick={copyToClipboard}>
                    📋 Copy Reply
                </button>
                <button className="btn btn-secondary btn-sm">
                    ✏️ Edit Draft
                </button>
            </div>
        </div>
    );
}
