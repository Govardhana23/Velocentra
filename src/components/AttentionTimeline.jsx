import React, { useRef, useEffect } from 'react';

export default function AttentionTimeline({ rankedMessages }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || rankedMessages.length === 0) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width, h = rect.height;
        const padding = { top: 20, right: 15, bottom: 30, left: 30 };
        const chartW = w - padding.left - padding.right;
        const chartH = h - padding.top - padding.bottom;

        ctx.clearRect(0, 0, w, h);

        // Sort by timestamp
        const sorted = [...rankedMessages].sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        const times = sorted.map(m => new Date(m.timestamp).getTime());
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        const timeRange = maxTime - minTime || 1;

        // Grid
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(w - padding.right, y);
            ctx.stroke();
        }

        // Y axis labels (score)
        ctx.fillStyle = '#64748b';
        ctx.font = '8px Inter';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartH / 4) * i;
            ctx.fillText(`${(100 - i * 25)}%`, padding.left - 5, y + 3);
        }

        // Score area fill
        ctx.beginPath();
        sorted.forEach((msg, i) => {
            const x = padding.left + ((times[i] - minTime) / timeRange) * chartW;
            const score = msg.scoring?.finalScore || 0;
            const y = padding.top + (1 - score) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        // Close the path for fill
        const lastX = padding.left + ((times[times.length - 1] - minTime) / timeRange) * chartW;
        ctx.lineTo(lastX, padding.top + chartH);
        ctx.lineTo(padding.left, padding.top + chartH);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Score line
        ctx.beginPath();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        sorted.forEach((msg, i) => {
            const x = padding.left + ((times[i] - minTime) / timeRange) * chartW;
            const score = msg.scoring?.finalScore || 0;
            const y = padding.top + (1 - score) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Data points
        const urgencyColors = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981' };
        sorted.forEach((msg, i) => {
            const x = padding.left + ((times[i] - minTime) / timeRange) * chartW;
            const score = msg.scoring?.finalScore || 0;
            const y = padding.top + (1 - score) * chartH;
            const color = urgencyColors[msg.urgency] || '#6366f1';

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = color + '60';
            ctx.lineWidth = 3;
            ctx.stroke();
        });

        // Time labels
        ctx.fillStyle = '#64748b';
        ctx.font = '8px Inter';
        ctx.textAlign = 'center';
        const labelCount = Math.min(6, sorted.length);
        const step = Math.floor(sorted.length / labelCount) || 1;
        for (let i = 0; i < sorted.length; i += step) {
            const x = padding.left + ((times[i] - minTime) / timeRange) * chartW;
            const date = new Date(times[i]);
            const label = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            ctx.fillText(label, x, h - 8);
        }
    }, [rankedMessages]);

    // Compute attention metrics
    const highPriorityCount = rankedMessages.filter(m => (m.scoring?.finalScore || 0) >= 0.7).length;
    const lowPriorityCount = rankedMessages.filter(m => (m.scoring?.finalScore || 0) < 0.4).length;
    const attentionPressure = rankedMessages.length > 0
        ? (highPriorityCount / rankedMessages.length * 100).toFixed(0)
        : 0;

    return (
        <div className="attention-timeline glass-card">
            <div className="section-title">
                <span className="icon">📈</span>
                Attention Timeline
            </div>

            <div className="timeline-metrics">
                <div className="tm-item">
                    <span className="tm-value" style={{ color: 'var(--accent-red)' }}>{highPriorityCount}</span>
                    <span className="tm-label">High Priority</span>
                </div>
                <div className="tm-item">
                    <span className="tm-value" style={{ color: 'var(--accent-green)' }}>{lowPriorityCount}</span>
                    <span className="tm-label">Low Priority</span>
                </div>
                <div className="tm-item">
                    <span className="tm-value" style={{ color: 'var(--accent-purple)' }}>{attentionPressure}%</span>
                    <span className="tm-label">Attention Pressure</span>
                </div>
            </div>

            <canvas ref={canvasRef} style={{ width: '100%', height: 180 }} />

            <div className="timeline-legend">
                {[
                    { color: '#ef4444', label: 'Critical' },
                    { color: '#f97316', label: 'High' },
                    { color: '#f59e0b', label: 'Medium' },
                    { color: '#10b981', label: 'Low' },
                ].map(item => (
                    <div key={item.label} className="tl-legend-item">
                        <span className="tl-dot" style={{ background: item.color }} />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
