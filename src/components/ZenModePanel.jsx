import React from 'react';

export default function ZenModePanel({ zenMode, toggleZenMode, filterStats }) {
    return (
        <div className="zen-panel glass-card">
            <div className="section-title">
                <span className="icon">🧘</span>
                Deep Work Mode
            </div>

            <div className="zen-toggle-wrapper">
                <span className="zen-toggle-label">
                    {zenMode ? '🟢 Active' : '⚫ Inactive'}
                </span>
                <button
                    className={`zen-toggle ${zenMode ? 'on' : 'off'}`}
                    onClick={toggleZenMode}
                >
                    <div className="thumb" />
                </button>
            </div>

            {zenMode && (
                <>
                    <div className="zen-stats">
                        <div className="zen-stat allowed">
                            <div className="stat-value">{filterStats.allowed}</div>
                            <div className="stat-label">Allowed</div>
                        </div>
                        <div className="zen-stat batched">
                            <div className="stat-value">{filterStats.batched}</div>
                            <div className="stat-label">Batched</div>
                        </div>
                        <div className="zen-stat delayed">
                            <div className="stat-value">{filterStats.delayed}</div>
                            <div className="stat-label">Delayed</div>
                        </div>
                    </div>

                    {filterStats.log && filterStats.log.length > 0 && (
                        <div className="filter-log">
                            <div className="section-title" style={{ marginTop: 12 }}>
                                <span className="icon">📋</span>
                                Filter Decisions
                            </div>
                            {filterStats.log.slice(-8).reverse().map((entry, i) => (
                                <div key={i} className={`filter-log-item ${entry.action}`}>
                                    <div className="log-sender">
                                        {entry.sender} — {entry.subject}
                                    </div>
                                    <div className="log-reason">{entry.reason}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
