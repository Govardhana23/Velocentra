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

export default function MessageDetailPanel({ selectedMessage, onMarkRead, onSnooze, onArchive }) {
    if (!selectedMessage) {
        return (
            <div className="message-detail glass-card">
                <div className="section-title">
                    <span className="icon">📄</span>
                    Message Detail
                </div>
                <div className="empty-state">
                    <div className="empty-icon">✉️</div>
                    <p>Select a message to view its full content</p>
                </div>
            </div>
        );
    }

    const msg = selectedMessage;
    const confidence = msg.scoring?.confidence || 0;

    return (
        <div className="message-detail glass-card animate-fadeIn">
            <div className="section-title">
                <span className="icon">📄</span>
                Message Detail
            </div>

            <div className="detail-header">
                <div className="detail-avatar">{msg.senderAvatar}</div>
                <div className="detail-meta">
                    <div className="detail-sender">{msg.senderName}</div>
                    <div className="detail-info">
                        <span className={`badge badge-${msg.urgency}`}>{msg.urgency}</span>
                        <span className="badge badge-role">{msg.senderRole}</span>
                        <span className="badge badge-role">{msg.category}</span>
                        <span className="detail-time">{formatTimeAgo(msg.timestamp)}</span>
                    </div>
                </div>
                <div className="detail-confidence">
                    <div className="confidence-ring" style={{
                        background: `conic-gradient(
              ${confidence >= 0.8 ? 'var(--accent-green)' : confidence >= 0.5 ? 'var(--accent-yellow)' : 'var(--accent-red)'}
              ${confidence * 360}deg,
              var(--bg-tertiary) ${confidence * 360}deg
            )`
                    }}>
                        <div className="confidence-inner">
                            {(confidence * 100).toFixed(0)}
                        </div>
                    </div>
                    <span className="confidence-label">Confidence</span>
                </div>
            </div>

            <div className="detail-subject">{msg.subject}</div>
            <div className="detail-body">{msg.body}</div>

            {msg.pastContext && (
                <div className="detail-context">
                    <span className="context-icon">🔗</span>
                    <span>Past context: <strong>{msg.pastContext}</strong></span>
                </div>
            )}

            <div className="detail-actions">
                <button className="btn btn-primary btn-sm" onClick={() => onMarkRead?.(msg.id)}>
                    ✓ Mark Read
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => onSnooze?.(msg.id)}>
                    ⏰ Snooze 1hr
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => onArchive?.(msg.id)}>
                    🗂️ Archive
                </button>
            </div>

            {msg.scoring && (
                <div className="detail-scoring-strip">
                    <div className="scoring-item">
                        <span className="scoring-label">Priority</span>
                        <span className="scoring-val" style={{ color: msg.scoring.finalScore >= 0.7 ? 'var(--accent-green)' : msg.scoring.finalScore >= 0.4 ? 'var(--accent-yellow)' : 'var(--accent-blue-light)' }}>
                            {(msg.scoring.finalScore * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div className="scoring-item">
                        <span className="scoring-label">Confidence</span>
                        <span className="scoring-val" style={{ color: confidence >= 0.8 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
                            {(confidence * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div className="scoring-item">
                        <span className="scoring-label">Urgency</span>
                        <span className={`badge badge-${msg.scoring.breakdown.urgencyLevel}`}>
                            {msg.scoring.breakdown.urgencyLevel}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
