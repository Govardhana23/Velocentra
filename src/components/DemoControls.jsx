import React from 'react';

export default function DemoControls({
    floodInbox,
    changeWorkload,
    simulateTime,
    triggerOverload,
    resetLearning,
    cognitiveLoad,
    floodCount,
}) {
    return (
        <div className="demo-controls glass-card">
            <div className="section-title">
                <span className="icon">🎮</span>
                Demo Controls
            </div>

            <div className="controls-grid">
                <button className="btn btn-primary" onClick={floodInbox}>
                    📨 Flood Inbox {floodCount > 0 && `(×${floodCount})`}
                </button>

                <button className="btn btn-danger" onClick={triggerOverload}>
                    ⚡ Trigger Overload
                </button>

                <button className="btn btn-secondary" onClick={simulateTime}>
                    ⏩ Simulate Time Step
                </button>

                <button className="btn btn-secondary btn-sm" onClick={resetLearning}>
                    🔄 Reset Learning Data
                </button>

                <div>
                    <div className="section-title" style={{ marginTop: 8, marginBottom: 6 }}>
                        <span className="icon">📊</span>
                        Workload Level
                    </div>
                    <div className="workload-selector">
                        {['low', 'medium', 'high'].map(level => (
                            <button
                                key={level}
                                className={`workload-btn ${cognitiveLoad === level ? 'active' : ''}`}
                                onClick={() => changeWorkload(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
