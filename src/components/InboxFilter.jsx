import React from 'react';

const ROLES = ['all', 'ceo', 'manager', 'hr', 'lead', 'colleague', 'marketing', 'system', 'external'];
const URGENCIES = ['all', 'critical', 'high', 'medium', 'low'];
const CATEGORIES = ['all', 'emergency', 'task', 'meeting', 'approval', 'question', 'fyi', 'social'];

export default function InboxFilter({ filters, onFilterChange, messageStats }) {
    return (
        <div className="inbox-filter glass-card">
            <div className="section-title">
                <span className="icon">🔎</span>
                Search & Filter
            </div>

            <div className="filter-search">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search messages..."
                    value={filters.search || ''}
                    onChange={e => onFilterChange({ ...filters, search: e.target.value })}
                />
            </div>

            <div className="filter-row">
                <label className="filter-label">Role</label>
                <div className="filter-chips">
                    {ROLES.map(role => (
                        <button
                            key={role}
                            className={`filter-chip ${filters.role === role ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, role })}
                        >
                            {role === 'all' ? '🌐 All' : role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-row">
                <label className="filter-label">Urgency</label>
                <div className="filter-chips">
                    {URGENCIES.map(urg => (
                        <button
                            key={urg}
                            className={`filter-chip ${filters.urgency === urg ? 'active' : ''} ${urg !== 'all' ? `chip-${urg}` : ''}`}
                            onClick={() => onFilterChange({ ...filters, urgency: urg })}
                        >
                            {urg === 'all' ? '🌐 All' : urg}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-row">
                <label className="filter-label">Category</label>
                <div className="filter-chips">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...filters, category: cat })}
                        >
                            {cat === 'all' ? '🌐 All' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {messageStats && (
                <div className="filter-stats-bar">
                    <div className="filter-stat-item">
                        <span className="fs-count">{messageStats.total}</span>
                        <span className="fs-label">Total</span>
                    </div>
                    <div className="filter-stat-item">
                        <span className="fs-count" style={{ color: 'var(--accent-red)' }}>{messageStats.critical}</span>
                        <span className="fs-label">Critical</span>
                    </div>
                    <div className="filter-stat-item">
                        <span className="fs-count" style={{ color: 'var(--accent-orange)' }}>{messageStats.high}</span>
                        <span className="fs-label">High</span>
                    </div>
                    <div className="filter-stat-item">
                        <span className="fs-count" style={{ color: 'var(--accent-yellow)' }}>{messageStats.medium}</span>
                        <span className="fs-label">Medium</span>
                    </div>
                    <div className="filter-stat-item">
                        <span className="fs-count" style={{ color: 'var(--accent-green)' }}>{messageStats.low}</span>
                        <span className="fs-label">Low</span>
                    </div>
                </div>
            )}
        </div>
    );
}
