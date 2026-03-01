import React, { useRef, useEffect } from 'react';

const ROLE_COLORS = {
    ceo: '#ef4444',
    manager: '#f97316',
    hr: '#f59e0b',
    lead: '#a855f7',
    colleague: '#6366f1',
    marketing: '#06b6d4',
    system: '#64748b',
    external: '#10b981',
};

const BASE_WEIGHTS = {
    ceo: 1.0, manager: 0.92, hr: 0.82, lead: 0.78,
    colleague: 0.55, marketing: 0.30, system: 0.20, external: 0.15,
};

export default function LearningDashboard({ weightHistory, learningData }) {
    const canvasRef = useRef(null);

    // Draw weight evolution chart
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !weightHistory || weightHistory.length < 2) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const padding = { top: 15, right: 15, bottom: 25, left: 35 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Grid lines
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();

            // Y labels
            ctx.fillStyle = '#64748b';
            ctx.font = '9px Inter';
            ctx.textAlign = 'right';
            ctx.fillText(((4 - i) * 25).toString() + '%', padding.left - 5, y + 3);
        }

        // Draw lines for each role
        const roles = ['manager', 'hr', 'colleague', 'marketing'];
        const maxEpochs = weightHistory.length;

        roles.forEach(role => {
            ctx.beginPath();
            ctx.strokeStyle = ROLE_COLORS[role];
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';

            weightHistory.forEach((snap, i) => {
                const x = padding.left + (i / (maxEpochs - 1)) * chartW;
                const val = snap.weights[role] || 0;
                const y = padding.top + (1 - val) * chartH;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.stroke();

            // Glow effect
            ctx.beginPath();
            ctx.strokeStyle = ROLE_COLORS[role] + '40';
            ctx.lineWidth = 6;
            ctx.lineJoin = 'round';

            weightHistory.forEach((snap, i) => {
                const x = padding.left + (i / (maxEpochs - 1)) * chartW;
                const val = snap.weights[role] || 0;
                const y = padding.top + (1 - val) * chartH;

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.stroke();
        });

        // Epoch labels
        ctx.fillStyle = '#64748b';
        ctx.font = '9px Inter';
        ctx.textAlign = 'center';
        const step = Math.max(1, Math.floor(maxEpochs / 5));
        for (let i = 0; i < maxEpochs; i += step) {
            const x = padding.left + (i / (maxEpochs - 1)) * chartW;
            ctx.fillText(`E${weightHistory[i].epoch}`, x, h - 5);
        }
    }, [weightHistory]);

    const adaptedWeights = learningData.adaptedWeights || {};
    const peakHours = learningData.peakHours || new Array(24).fill(0);
    const maxActivity = Math.max(...peakHours, 1);

    const getWeightChange = (role) => {
        const base = BASE_WEIGHTS[role] || 0;
        const adapted = adaptedWeights[role] || base;
        const diff = adapted - base;
        if (diff > 0.01) return { text: `+${(diff * 100).toFixed(0)}%`, className: 'up' };
        if (diff < -0.01) return { text: `${(diff * 100).toFixed(0)}%`, className: 'down' };
        return { text: '—', className: 'neutral' };
    };

    return (
        <div className="learning-panel glass-card">
            <div className="section-title">
                <span className="icon">📈</span>
                Behavioral Learning
            </div>

            {/* Weight Evolution Chart */}
            <div className="chart-container">
                {weightHistory.length >= 2 ? (
                    <canvas ref={canvasRef} className="chart-canvas" style={{ width: '100%', height: '100%' }} />
                ) : (
                    <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div>
                            <div className="empty-icon">📊</div>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Click "Simulate Time Step" to generate learning data</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                {['manager', 'hr', 'colleague', 'marketing'].map(role => (
                    <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: 10, height: 3, borderRadius: 2, background: ROLE_COLORS[role] }} />
                        {role}
                    </div>
                ))}
            </div>

            {/* Current Weights */}
            <div className="section-title" style={{ marginTop: 8 }}>
                <span className="icon">⚖️</span>
                Adapted Sender Weights
            </div>
            <div className="weight-grid">
                {Object.entries(adaptedWeights).map(([role, weight]) => {
                    const change = getWeightChange(role);
                    return (
                        <div key={role} className="weight-item">
                            <div className="weight-role">{role}</div>
                            <div className="weight-value">{(weight * 100).toFixed(0)}</div>
                            <div className={`weight-change ${change.className}`}>{change.text}</div>
                        </div>
                    );
                })}
            </div>

            {/* Peak Focus Hours Heatmap */}
            <div className="heatmap-container">
                <div className="section-title" style={{ marginTop: 16 }}>
                    <span className="icon">🕐</span>
                    Focus Activity by Hour
                </div>
                <div className="heatmap-grid">
                    {peakHours.slice(6, 18).map((val, i) => {
                        const intensity = val / maxActivity;
                        const bg = `rgba(99, 102, 241, ${0.05 + intensity * 0.6})`;
                        return (
                            <div
                                key={i}
                                className="heatmap-cell"
                                style={{ background: bg }}
                                title={`${i + 6}:00 — ${val} interactions`}
                            >
                                {val > 0 ? val : ''}
                            </div>
                        );
                    })}
                </div>
                <div className="heatmap-labels">
                    {Array.from({ length: 12 }, (_, i) => (
                        <span key={i}>{i + 6}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
