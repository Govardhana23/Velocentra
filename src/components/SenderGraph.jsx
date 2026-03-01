import React, { useRef, useEffect } from 'react';

const ROLE_COLORS = {
    ceo: '#ef4444', manager: '#f97316', hr: '#f59e0b', lead: '#a855f7',
    colleague: '#6366f1', marketing: '#06b6d4', system: '#64748b', external: '#10b981',
};

export default function SenderGraph({ rankedMessages }) {
    const canvasRef = useRef(null);

    const senderMap = {};
    rankedMessages.forEach(msg => {
        if (!senderMap[msg.senderId]) {
            senderMap[msg.senderId] = {
                id: msg.senderId,
                name: msg.senderName,
                role: msg.senderRole,
                avatar: msg.senderAvatar,
                count: 0,
                totalScore: 0,
                avgScore: 0,
            };
        }
        senderMap[msg.senderId].count++;
        senderMap[msg.senderId].totalScore += msg.scoring?.finalScore || 0;
    });

    const senders = Object.values(senderMap).map(s => ({
        ...s,
        avgScore: s.totalScore / s.count,
    })).sort((a, b) => b.count - a.count);

    // Draw relationship graph
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || senders.length === 0) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width, h = rect.height;
        const cx = w / 2, cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Central node (You)
        const youR = 20;
        ctx.beginPath();
        ctx.arc(cx, cy, youR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('You', cx, cy);

        // Sender nodes around
        const maxCount = Math.max(...senders.map(s => s.count), 1);
        senders.forEach((sender, i) => {
            const angle = (i / senders.length) * Math.PI * 2 - Math.PI / 2;
            const distance = 55 + sender.avgScore * 40;
            const x = cx + Math.cos(angle) * distance;
            const y = cy + Math.sin(angle) * distance;
            const nodeR = 8 + (sender.count / maxCount) * 12;
            const color = ROLE_COLORS[sender.role] || '#6366f1';

            // Connection line
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(x, y);
            ctx.strokeStyle = color + '40';
            ctx.lineWidth = 1 + (sender.count / maxCount) * 3;
            ctx.stroke();

            // Node
            ctx.beginPath();
            ctx.arc(x, y, nodeR, 0, Math.PI * 2);
            ctx.fillStyle = color + '30';
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = '#f1f5f9';
            ctx.font = '8px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(sender.name.split(' ')[0], x, y + nodeR + 10);

            // Count badge
            ctx.fillStyle = color;
            ctx.font = 'bold 8px Inter';
            ctx.fillText(sender.count, x, y + 3);
        });
    }, [rankedMessages]);

    return (
        <div className="sender-graph glass-card">
            <div className="section-title">
                <span className="icon">🕸️</span>
                Sender Relationship Graph
            </div>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: 220 }}
            />
            <div className="sender-legend">
                {senders.slice(0, 6).map(s => (
                    <div key={s.id} className="sender-legend-item">
                        <span className="sender-dot" style={{ background: ROLE_COLORS[s.role] || '#6366f1' }} />
                        <span className="sender-name">{s.name}</span>
                        <span className="sender-count">{s.count} msgs</span>
                        <span className="sender-score" style={{
                            color: s.avgScore >= 0.6 ? 'var(--accent-green)' : s.avgScore >= 0.4 ? 'var(--accent-yellow)' : 'var(--accent-blue-light)'
                        }}>
                            Avg: {(s.avgScore * 100).toFixed(0)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
