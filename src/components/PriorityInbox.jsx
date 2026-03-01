import React from 'react';

function formatTimeAgo(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function getScoreClass(score) {
    if (score >= 0.7) return 'score-high';
    if (score >= 0.4) return 'score-medium';
    return 'score-low';
}

export default function PriorityInbox({ rankedMessages, selectedMessage, selectMessage, zenMode, readMessages }) {
    const visibleMessages = zenMode
        ? rankedMessages.filter(m => !m.filterResult || m.filterResult.action === 'allow')
        : rankedMessages;

    const batchedMessages = zenMode
        ? rankedMessages.filter(m => m.filterResult && m.filterResult.action === 'batch')
        : [];

    const delayedMessages = zenMode
        ? rankedMessages.filter(m => m.filterResult && m.filterResult.action === 'delay')
        : [];

    return (
        <div className="priority-inbox glass-card-strong">
            <div className="inbox-header">
                <div className="section-title" style={{ marginBottom: 0 }}>
                    <span className="icon">📬</span>
                    Priority Inbox
                    {zenMode && <span className="badge badge-role" style={{ marginLeft: 8 }}>🧘 ZEN</span>}
                </div>
                <div className="inbox-count">{visibleMessages.length}</div>
            </div>

            <div className="inbox-list">
                {visibleMessages.map((msg, index) => (
                    <div
                        key={msg.id}
                        className={`inbox-item ${selectedMessage?.id === msg.id ? 'selected' : ''} ${readMessages?.has(msg.id) ? 'is-read' : ''}`}
                        onClick={() => selectMessage(msg)}
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <div className="avatar">{msg.senderAvatar}</div>
                        <div className="inbox-item-content">
                            <div className="inbox-item-header">
                                <span className="inbox-item-sender">{msg.senderName}</span>
                                <span className="badge badge-role">{msg.senderRole}</span>
                                <span className={`badge badge-${msg.urgency}`}>{msg.urgency}</span>
                            </div>
                            <div className="inbox-item-subject">{msg.subject}</div>
                            <div className="inbox-item-time">{formatTimeAgo(msg.timestamp)}</div>
                        </div>
                        <div className="score-badge">
                            <div className={`score-value ${getScoreClass(msg.scoring?.finalScore || 0)}`}>
                                {((msg.scoring?.finalScore || 0) * 100).toFixed(0)}
                            </div>
                            <div className="score-label">
                                {msg.scoring?.confidence ? `${(msg.scoring.confidence * 100).toFixed(0)}% conf` : 'Score'}
                            </div>
                        </div>
                    </div>
                ))}

                {zenMode && batchedMessages.length > 0 && (
                    <>
                        <div className="section-title" style={{ marginTop: 12 }}>
                            <span className="icon">📦</span>
                            Batched ({batchedMessages.length})
                        </div>
                        {batchedMessages.map(msg => (
                            <div key={msg.id} className="inbox-item zen-batched" onClick={() => selectMessage(msg)}>
                                <div className="avatar">{msg.senderAvatar}</div>
                                <div className="inbox-item-content">
                                    <div className="inbox-item-header">
                                        <span className="inbox-item-sender">{msg.senderName}</span>
                                        <span className="badge badge-medium">batched</span>
                                    </div>
                                    <div className="inbox-item-subject">{msg.subject}</div>
                                </div>
                                <div className="score-badge">
                                    <div className={`score-value score-medium`}>
                                        {((msg.scoring?.finalScore || 0) * 100).toFixed(0)}
                                    </div>
                                    <div className="score-label">Score</div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {zenMode && delayedMessages.length > 0 && (
                    <>
                        <div className="section-title" style={{ marginTop: 12 }}>
                            <span className="icon">⏸️</span>
                            Delayed ({delayedMessages.length})
                        </div>
                        {delayedMessages.map(msg => (
                            <div key={msg.id} className="inbox-item zen-hidden">
                                <div className="avatar">{msg.senderAvatar}</div>
                                <div className="inbox-item-content">
                                    <div className="inbox-item-header">
                                        <span className="inbox-item-sender">{msg.senderName}</span>
                                        <span className="badge badge-low">delayed</span>
                                    </div>
                                    <div className="inbox-item-subject">{msg.subject}</div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
