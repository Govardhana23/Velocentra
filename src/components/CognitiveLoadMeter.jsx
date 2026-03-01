import React from 'react';

export default function CognitiveLoadMeter({ cognitiveLoad, stressLevel }) {
    const getNeedleRotation = () => {
        switch (cognitiveLoad) {
            case 'low': return -60;
            case 'medium': return 0;
            case 'high': return 60;
            default: return 0;
        }
    };

    const getStressColor = () => {
        if (stressLevel >= 0.7) return 'var(--accent-red)';
        if (stressLevel >= 0.4) return 'var(--accent-yellow)';
        return 'var(--accent-green)';
    };

    return (
        <div className="cognitive-meter glass-card">
            <div className="section-title">
                <span className="icon">🧠</span>
                Cognitive Load
            </div>

            <div className="meter-display">
                <div className="meter-arc" />
                <div
                    className="meter-needle"
                    style={{ transform: `rotate(${getNeedleRotation()}deg)` }}
                />
                <div className={`meter-value ${cognitiveLoad}`}>
                    {cognitiveLoad}
                </div>
            </div>

            <div className="stress-bar">
                <div className="stress-bar-label">
                    <span>Stress Level</span>
                    <span>{(stressLevel * 100).toFixed(0)}%</span>
                </div>
                <div className="stress-bar-track">
                    <div
                        className="stress-bar-fill"
                        style={{
                            width: `${stressLevel * 100}%`,
                            background: getStressColor(),
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
