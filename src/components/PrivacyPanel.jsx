import React from 'react';

export default function PrivacyPanel() {
    return (
        <div className="privacy-panel glass-card">
            <div className="section-title">
                <span className="icon">🔐</span>
                Privacy Architecture
            </div>

            <div className="privacy-features">
                <div className="privacy-feature">
                    <span className="feature-icon">🏠</span>
                    <span className="feature-text">
                        <strong>100% Local Processing</strong> — All scoring, filtering, and learning run on-device
                    </span>
                </div>
                <div className="privacy-feature">
                    <span className="feature-icon">🚫</span>
                    <span className="feature-text">
                        <strong>No Raw Behavior Exported</strong> — Behavioral data never leaves your machine
                    </span>
                </div>
                <div className="privacy-feature">
                    <span className="feature-icon">💾</span>
                    <span className="feature-text">
                        <strong>localStorage Only</strong> — Learned weights persist in browser, nowhere else
                    </span>
                </div>
                <div className="privacy-feature">
                    <span className="feature-icon">🔒</span>
                    <span className="feature-text">
                        <strong>Zero Network Calls</strong> — No external API, cloud, or telemetry dependencies
                    </span>
                </div>
            </div>

            <div className="section-title">
                <span className="icon">🏗️</span>
                Data Flow Architecture
            </div>

            <div className="architecture-diagram">
                <div className="arch-flow">
                    <div className="arch-node input">📨 Incoming Messages (Simulated)</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node process">🧠 Priority Scoring Engine (Client-side JS)</div>
                    <div className="arch-arrow">↓</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div className="arch-node process">🧘 Distraction Filter</div>
                        <div className="arch-node process">✉️ Reply Generator</div>
                    </div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node storage">💾 localStorage (Learned Weights)</div>
                    <div className="arch-arrow">↓</div>
                    <div className="arch-node output">📊 Dashboard (React UI)</div>
                </div>
            </div>
        </div>
    );
}
