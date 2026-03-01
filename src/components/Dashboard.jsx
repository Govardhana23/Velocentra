import React from 'react';
import CognitiveLoadMeter from './CognitiveLoadMeter';
import ZenModePanel from './ZenModePanel';
import DemoControls from './DemoControls';
import PriorityInbox from './PriorityInbox';
import ExplanationPanel from './ExplanationPanel';
import ReplyGeneratorPanel from './ReplyGeneratorPanel';
import ProactiveSuggestions from './ProactiveSuggestions';
import LearningDashboard from './LearningDashboard';
import PrivacyPanel from './PrivacyPanel';
import MessageDetailPanel from './MessageDetailPanel';
import InboxFilter from './InboxFilter';
import AnalyticsPanel from './AnalyticsPanel';
import SenderGraph from './SenderGraph';
import AttentionTimeline from './AttentionTimeline';
import NotificationToast from './NotificationToast';

export default function Dashboard({
    messages,
    rankedMessages,
    filteredMessages,
    selectedMessage,
    cognitiveLoad,
    zenMode,
    filterStats,
    replies,
    suggestions,
    weightHistory,
    learningData,
    stressLevel,
    floodCount,
    filters,
    messageStats,
    readMessages,
    floodInbox,
    toggleZenMode,
    changeWorkload,
    selectMessage,
    simulateTime,
    triggerOverload,
    acceptSuggestion,
    dismissSuggestion,
    resetLearning,
    markRead,
    snoozeMessage,
    archiveMessage,
    onFilterChange,
}) {
    return (
        <div className={`dashboard ${zenMode ? 'zen-active' : ''}`}>
            {/* Notification Toasts */}
            <NotificationToast rankedMessages={rankedMessages} zenMode={zenMode} />

            {/* Header */}
            <header className="dashboard-header glass-card-strong">
                <div className="logo">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Velocentra OS" className="logo-img" />
                </div>
                <div className="header-status">
                    <div className="privacy-badge">
                        <span className="dot" />
                        All Processing Local
                    </div>
                    <div className="privacy-badge" style={{ borderColor: 'rgba(99, 102, 241, 0.25)', color: 'var(--accent-blue-light)', background: 'rgba(99, 102, 241, 0.1)' }}>
                        <span className="dot" style={{ background: 'var(--accent-blue)' }} />
                        {rankedMessages.length} Messages Tracked
                    </div>
                    {messageStats && (
                        <div className="privacy-badge" style={{ borderColor: 'rgba(245, 158, 11, 0.25)', color: 'var(--accent-yellow)', background: 'rgba(245, 158, 11, 0.1)' }}>
                            🔴 {messageStats.critical} Critical
                        </div>
                    )}
                    {zenMode && (
                        <div className="privacy-badge animate-glow" style={{ borderColor: 'rgba(139, 92, 246, 0.5)', color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.15)' }}>
                            🧘 Deep Work Mode Active
                        </div>
                    )}
                </div>
            </header>

            {/* Left Sidebar */}
            <aside className="sidebar-left">
                <CognitiveLoadMeter
                    cognitiveLoad={cognitiveLoad}
                    stressLevel={stressLevel}
                />
                <ZenModePanel
                    zenMode={zenMode}
                    toggleZenMode={toggleZenMode}
                    filterStats={filterStats}
                />
                <DemoControls
                    floodInbox={floodInbox}
                    changeWorkload={changeWorkload}
                    simulateTime={simulateTime}
                    triggerOverload={triggerOverload}
                    resetLearning={resetLearning}
                    cognitiveLoad={cognitiveLoad}
                    floodCount={floodCount}
                />
            </aside>

            {/* Center: Filter + Priority Inbox + Message Detail */}
            <main className="main-content">
                <InboxFilter
                    filters={filters}
                    onFilterChange={onFilterChange}
                    messageStats={messageStats}
                />
                <PriorityInbox
                    rankedMessages={filteredMessages || rankedMessages}
                    selectedMessage={selectedMessage}
                    selectMessage={selectMessage}
                    zenMode={zenMode}
                    readMessages={readMessages}
                />
                <MessageDetailPanel
                    selectedMessage={selectedMessage}
                    onMarkRead={markRead}
                    onSnooze={snoozeMessage}
                    onArchive={archiveMessage}
                />
            </main>

            {/* Right Sidebar */}
            <aside className="sidebar-right">
                <ExplanationPanel selectedMessage={selectedMessage} />
                <ReplyGeneratorPanel replies={replies} selectedMessage={selectedMessage} />
                <ProactiveSuggestions
                    suggestions={suggestions}
                    acceptSuggestion={acceptSuggestion}
                    dismissSuggestion={dismissSuggestion}
                />
            </aside>

            {/* Bottom Panel — expanded to 3 columns */}
            <section className="bottom-panel">
                <LearningDashboard
                    weightHistory={weightHistory}
                    learningData={learningData}
                />
                <AnalyticsPanel
                    rankedMessages={filteredMessages || rankedMessages}
                    stressLevel={stressLevel}
                    cognitiveLoad={cognitiveLoad}
                />
                <SenderGraph rankedMessages={rankedMessages} />
            </section>

            {/* Extra Bottom Row */}
            <section className="bottom-panel-extra">
                <AttentionTimeline rankedMessages={filteredMessages || rankedMessages} />
                <PrivacyPanel />
            </section>
        </div>
    );
}
