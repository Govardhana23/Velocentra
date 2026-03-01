import React, { useRef, useEffect } from 'react';

export default function AnalyticsPanel({ rankedMessages, stressLevel, cognitiveLoad }) {
    const donutRef = useRef(null);
    const barRef = useRef(null);

    // Compute stats
    const urgencyCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    const roleCounts = {};
    const categoryCounts = {};
    let totalScore = 0;
    let maxScore = 0;
    let minScore = 1;

    rankedMessages.forEach(msg => {
        urgencyCounts[msg.urgency] = (urgencyCounts[msg.urgency] || 0) + 1;
        roleCounts[msg.senderRole] = (roleCounts[msg.senderRole] || 0) + 1;
        categoryCounts[msg.category] = (categoryCounts[msg.category] || 0) + 1;
        const s = msg.scoring?.finalScore || 0;
        totalScore += s;
        if (s > maxScore) maxScore = s;
        if (s < minScore) minScore = s;
    });
    const avgScore = rankedMessages.length > 0 ? totalScore / rankedMessages.length : 0;

    // Draw urgency donut chart
    useEffect(() => {
        const canvas = donutRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const size = 120;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        const total = Object.values(urgencyCounts).reduce((a, b) => a + b, 0) || 1;
        const colors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981' };
        const cx = size / 2, cy = size / 2, r = 45, inner = 30;

        let startAngle = -Math.PI / 2;
        for (const [level, count] of Object.entries(urgencyCounts)) {
            const sweep = (count / total) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
            ctx.arc(cx, cy, inner, startAngle + sweep, startAngle, true);
            ctx.closePath();
            ctx.fillStyle = colors[level];
            ctx.fill();
            startAngle += sweep;
        }

        // Center text
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total, cx, cy - 6);
        ctx.font = '8px Inter';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('messages', cx, cy + 8);
    }, [rankedMessages]);

    // Draw category bar chart
    useEffect(() => {
        const canvas = barRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width, h = rect.height;
        const cats = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
        const maxVal = Math.max(...cats.map(c => c[1]), 1);
        const barW = Math.min(30, (w - 20) / cats.length - 6);
        const barGap = (w - cats.length * barW) / (cats.length + 1);

        ctx.clearRect(0, 0, w, h);

        const catColors = {
            emergency: '#ef4444', task: '#6366f1', meeting: '#8b5cf6', approval: '#f59e0b',
            question: '#06b6d4', fyi: '#10b981', social: '#ec4899',
        };

        cats.forEach(([cat, count], i) => {
            const x = barGap + i * (barW + barGap);
            const barH = (count / maxVal) * (h - 30);
            const y = h - 18 - barH;
            const color = catColors[cat] || '#6366f1';

            // Bar
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, barH, 3);
            ctx.fill();

            // Glow
            ctx.fillStyle = color + '30';
            ctx.beginPath();
            ctx.roundRect(x - 2, y - 2, barW + 4, barH + 4, 5);
            ctx.fill();

            // Label
            ctx.fillStyle = '#64748b';
            ctx.font = '7px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(cat.slice(0, 5), x + barW / 2, h - 5);

            // Count
            ctx.fillStyle = '#f1f5f9';
            ctx.font = 'bold 9px Inter';
            ctx.fillText(count, x + barW / 2, y - 4);
        });
    }, [rankedMessages]);

    const sortedRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]);

    return (
        <div className="analytics-panel glass-card">
            <div className="section-title">
                <span className="icon">📊</span>
                Analytics & Statistics
            </div>

            {/* KPI strip */}
            <div className="analytics-kpis">
                <div className="kpi-item">
                    <div className="kpi-value">{rankedMessages.length}</div>
                    <div className="kpi-label">Total</div>
                </div>
                <div className="kpi-item">
                    <div className="kpi-value" style={{ color: 'var(--accent-blue-light)' }}>
                        {(avgScore * 100).toFixed(0)}%
                    </div>
                    <div className="kpi-label">Avg Score</div>
                </div>
                <div className="kpi-item">
                    <div className="kpi-value" style={{ color: 'var(--accent-green)' }}>
                        {(maxScore * 100).toFixed(0)}%
                    </div>
                    <div className="kpi-label">Highest</div>
                </div>
                <div className="kpi-item">
                    <div className="kpi-value" style={{ color: 'var(--accent-red)' }}>
                        {(minScore * 100).toFixed(0)}%
                    </div>
                    <div className="kpi-label">Lowest</div>
                </div>
            </div>

            <div className="analytics-charts-row">
                {/* Urgency Donut */}
                <div className="analytics-chart-block">
                    <div className="chart-subtitle">Urgency Distribution</div>
                    <canvas ref={donutRef} />
                    <div className="donut-legend">
                        {Object.entries(urgencyCounts).map(([level, count]) => (
                            <div key={level} className="legend-item">
                                <span className={`legend-dot badge-${level}`} />
                                <span>{level}: {count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category bars */}
                <div className="analytics-chart-block" style={{ flex: 1 }}>
                    <div className="chart-subtitle">Message Categories</div>
                    <canvas ref={barRef} style={{ width: '100%', height: 120 }} />
                </div>
            </div>

            {/* Role Distribution */}
            <div className="chart-subtitle" style={{ marginTop: 12 }}>Sender Roles</div>
            <div className="role-bars">
                {sortedRoles.map(([role, count]) => (
                    <div key={role} className="role-bar-item">
                        <span className="role-bar-label">{role}</span>
                        <div className="role-bar-track">
                            <div
                                className="role-bar-fill"
                                style={{ width: `${(count / rankedMessages.length) * 100}%` }}
                            />
                        </div>
                        <span className="role-bar-count">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
