import React, { useEffect, useState } from 'react';

export default function NotificationToast({ rankedMessages, zenMode }) {
    const [toasts, setToasts] = useState([]);

    // Watch for critical messages and show toasts
    useEffect(() => {
        const criticalMessages = rankedMessages.filter(
            m => m.urgency === 'critical' && (m.scoring?.finalScore || 0) >= 0.7
        );

        if (criticalMessages.length > 0 && !zenMode) {
            const newToasts = criticalMessages.slice(0, 3).map(msg => ({
                id: `toast_${msg.id}_${Date.now()}`,
                messageId: msg.id,
                sender: msg.senderName,
                avatar: msg.senderAvatar,
                subject: msg.subject,
                score: msg.scoring?.finalScore || 0,
                type: 'critical',
                timestamp: Date.now(),
            }));

            setToasts(prev => {
                // Avoid duplicate toasts for same message
                const existingIds = new Set(prev.map(t => t.messageId));
                const fresh = newToasts.filter(t => !existingIds.has(t.messageId));
                return [...fresh, ...prev].slice(0, 5);
            });
        }
    }, [rankedMessages.length]); // Only trigger on message count change

    // Auto-dismiss toasts after 8 seconds
    useEffect(() => {
        if (toasts.length === 0) return;
        const timer = setTimeout(() => {
            setToasts(prev => prev.slice(0, -1));
        }, 8000);
        return () => clearTimeout(timer);
    }, [toasts]);

    const dismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast, i) => (
                <div
                    key={toast.id}
                    className={`toast-item toast-${toast.type} animate-slideRight`}
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="toast-icon">{toast.avatar}</div>
                    <div className="toast-body">
                        <div className="toast-sender">{toast.sender}</div>
                        <div className="toast-subject">{toast.subject}</div>
                    </div>
                    <div className="toast-score">
                        {(toast.score * 100).toFixed(0)}%
                    </div>
                    <button className="toast-dismiss" onClick={() => dismissToast(toast.id)}>
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
