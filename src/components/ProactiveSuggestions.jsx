import React from 'react';

export default function ProactiveSuggestions({ suggestions, acceptSuggestion, dismissSuggestion }) {
    if (!suggestions || suggestions.length === 0) {
        return (
            <div className="suggestions-panel glass-card">
                <div className="section-title">
                    <span className="icon">⚡</span>
                    Proactive Suggestions
                </div>
                <div className="empty-state">
                    <div className="empty-icon">🌤️</div>
                    <p>No suggestions right now. Workflow looks manageable!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="suggestions-panel glass-card">
            <div className="section-title">
                <span className="icon">⚡</span>
                Proactive Suggestions
                <span className="badge badge-critical" style={{ marginLeft: 'auto' }}>
                    {suggestions.length} active
                </span>
            </div>

            {suggestions.map((suggestion, i) => (
                <div
                    key={suggestion.id}
                    className="suggestion-card"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    <div className="suggestion-icon">{suggestion.icon}</div>
                    <div className="suggestion-body">
                        <div className="suggestion-title">{suggestion.title}</div>
                        <div className="suggestion-desc">{suggestion.description}</div>
                        <div className="suggestion-impact">
                            <span>Impact:</span>
                            <span style={{ color: suggestion.impact >= 0.8 ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>
                                {(suggestion.impact * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="suggestion-actions">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => acceptSuggestion(suggestion.id)}
                            >
                                ✓ {suggestion.actionLabel}
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => dismissSuggestion(suggestion.id)}
                            >
                                ✗ Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
