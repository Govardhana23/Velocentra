import React from 'react';

const FACTOR_COLORS = {
    senderImportance: 'var(--accent-blue)',
    interactionWeight: 'var(--accent-cyan)',
    urgencyScore: 'var(--accent-orange)',
    taskAlignment: 'var(--accent-purple)',
    cognitiveBandwidth: 'var(--accent-green)',
};

const FACTOR_LABELS = {
    senderImportance: 'Sender Importance',
    interactionWeight: 'Interaction History',
    urgencyScore: 'Urgency Detection',
    taskAlignment: 'Task Alignment',
    cognitiveBandwidth: 'Cognitive Bandwidth',
};

export default function ExplanationPanel({ selectedMessage }) {
    if (!selectedMessage || !selectedMessage.scoring) {
        return (
            <div className="explanation-panel glass-card">
                <div className="section-title">
                    <span className="icon">🔍</span>
                    Score Breakdown
                </div>
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>Select a message to see its priority score breakdown and reasoning</p>
                </div>
            </div>
        );
    }

    const { scoring } = selectedMessage;
    const { breakdown } = scoring;
    const scorePercent = (scoring.finalScore * 100).toFixed(0);

    const getScoreColor = () => {
        if (scoring.finalScore >= 0.7) return 'var(--accent-green)';
        if (scoring.finalScore >= 0.4) return 'var(--accent-yellow)';
        return 'var(--accent-blue-light)';
    };

    const getScoreBg = () => {
        if (scoring.finalScore >= 0.7) return 'rgba(16, 185, 129, 0.15)';
        if (scoring.finalScore >= 0.4) return 'rgba(245, 158, 11, 0.15)';
        return 'rgba(99, 102, 241, 0.15)';
    };

    const factors = [
        ['senderImportance', breakdown.senderImportance],
        ['interactionWeight', breakdown.interactionWeight],
        ['urgencyScore', breakdown.urgencyScore],
        ['taskAlignment', breakdown.taskAlignment],
        ['cognitiveBandwidth', breakdown.cognitiveBandwidth],
    ];

    return (
        <div className="explanation-panel glass-card">
            <div className="section-title">
                <span className="icon">🔍</span>
                Score Breakdown
            </div>

            <div className="score-overview">
                <div
                    className="score-big"
                    style={{
                        background: getScoreBg(),
                        color: getScoreColor(),
                        border: `2px solid ${getScoreColor()}`,
                    }}
                >
                    {scorePercent}
                </div>
                <div className="score-context">
                    <h3>{selectedMessage.senderName}</h3>
                    <p>{selectedMessage.subject}</p>
                    <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                        <span className={`badge badge-${breakdown.urgencyLevel}`}>
                            {breakdown.urgencyLevel}
                        </span>
                        {breakdown.urgencyKeyword && (
                            <span className="badge badge-role">"{breakdown.urgencyKeyword}"</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="factor-bars">
                {factors.map(([key, value], i) => (
                    <div key={key} className="factor-bar" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="factor-header">
                            <span className="factor-name">{FACTOR_LABELS[key]}</span>
                            <span className="factor-value">{(value * 100).toFixed(0)}%</span>
                        </div>
                        <div className="bar-track">
                            <div
                                className="bar-fill"
                                style={{
                                    width: `${value * 100}%`,
                                    background: FACTOR_COLORS[key],
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="explanation-text">
                💡 {scoring.explanation}
            </div>
        </div>
    );
}
