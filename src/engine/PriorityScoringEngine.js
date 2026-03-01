// PriorityScoringEngine.js
// Calculates dynamic priority scores using multi-factor analysis

const URGENCY_KEYWORDS = {
    critical: ['emergency', 'critical', 'immediately', 'right now', 'crisis', 'outage', 'down'],
    high: ['urgent', 'asap', 'deadline', 'eod', 'today', 'important', 'priority', 'blocking'],
    medium: ['soon', 'this week', 'follow up', 'reminder', 'update', 'review'],
    low: ['fyi', 'newsletter', 'optional', 'when you get a chance', 'no rush', 'info'],
};

const DEFAULT_SENDER_WEIGHTS = {
    ceo: 1.0,
    manager: 0.92,
    hr: 0.82,
    lead: 0.78,
    colleague: 0.55,
    marketing: 0.30,
    system: 0.20,
    external: 0.15,
};

const COGNITIVE_BANDWIDTH_MODIFIERS = {
    low: 1.0,    // All messages scored normally
    medium: 0.85, // Slight reduction for non-critical
    high: 0.65,   // Significant reduction for non-critical
};

export class PriorityScoringEngine {
    constructor() {
        this.senderWeights = { ...DEFAULT_SENDER_WEIGHTS };
        this.interactionHistory = {};
        this.currentProject = 'Q4 Product Launch';
        this.projectKeywords = ['launch', 'product', 'release', 'deploy', 'sprint', 'feature', 'milestone'];
    }

    updateSenderWeights(learnedWeights) {
        this.senderWeights = { ...this.senderWeights, ...learnedWeights };
    }

    updateInteractionHistory(history) {
        this.interactionHistory = history;
    }

    detectUrgency(text) {
        const lower = text.toLowerCase();
        for (const [level, keywords] of Object.entries(URGENCY_KEYWORDS)) {
            for (const kw of keywords) {
                if (lower.includes(kw)) {
                    return { level, keyword: kw };
                }
            }
        }
        return { level: 'low', keyword: null };
    }

    getUrgencyScore(level) {
        return { critical: 1.0, high: 0.85, medium: 0.55, low: 0.25 }[level] || 0.25;
    }

    getSenderImportance(senderRole) {
        return this.senderWeights[senderRole] || 0.3;
    }

    getInteractionWeight(senderId) {
        const history = this.interactionHistory[senderId];
        if (!history) return 0.5;
        const { responseRate, avgResponseTime, frequency } = history;
        return Math.min(1.0, (responseRate * 0.4) + (1 / (1 + avgResponseTime / 60) * 0.3) + (Math.min(frequency / 20, 1) * 0.3));
    }

    getTaskAlignment(text) {
        const lower = text.toLowerCase();
        let matches = 0;
        for (const kw of this.projectKeywords) {
            if (lower.includes(kw)) matches++;
        }
        return Math.min(1.0, 0.3 + (matches * 0.2));
    }

    getCognitiveBandwidth(cognitiveLoad) {
        return COGNITIVE_BANDWIDTH_MODIFIERS[cognitiveLoad] || 1.0;
    }

    scoreMessage(message, cognitiveLoad = 'medium') {
        const senderImportance = this.getSenderImportance(message.senderRole);
        const interactionWeight = this.getInteractionWeight(message.senderId);
        const urgencyInfo = this.detectUrgency(message.subject + ' ' + message.body);
        const urgencyScore = this.getUrgencyScore(urgencyInfo.level);
        const taskAlignment = this.getTaskAlignment(message.subject + ' ' + message.body);
        const cognitiveBandwidth = this.getCognitiveBandwidth(cognitiveLoad);

        // Apply cognitive bandwidth only to non-critical messages
        const bandwidthModifier = urgencyInfo.level === 'critical' ? 1.0 : cognitiveBandwidth;

        // Weighted geometric-ish mean to ensure all factors contribute
        const rawScore = (
            senderImportance * 0.30 +
            interactionWeight * 0.15 +
            urgencyScore * 0.30 +
            taskAlignment * 0.15 +
            bandwidthModifier * 0.10
        );

        const finalScore = Math.min(1.0, Math.max(0, rawScore));

        // Confidence score — how much evidence supports this score
        const hasUrgencyKeyword = urgencyInfo.keyword !== null ? 1.0 : 0.4;
        const hasHistory = this.interactionHistory[message.senderId] ? 1.0 : 0.3;
        const hasTaskMatch = taskAlignment > 0.3 ? 0.9 : 0.5;
        const senderKnown = this.senderWeights[message.senderRole] !== undefined ? 1.0 : 0.3;
        const confidence = Math.min(1.0, (hasUrgencyKeyword * 0.3 + hasHistory * 0.25 + hasTaskMatch * 0.2 + senderKnown * 0.25));

        return {
            messageId: message.id,
            finalScore: Math.round(finalScore * 1000) / 1000,
            confidence: Math.round(confidence * 1000) / 1000,
            breakdown: {
                senderImportance: Math.round(senderImportance * 1000) / 1000,
                interactionWeight: Math.round(interactionWeight * 1000) / 1000,
                urgencyScore: Math.round(urgencyScore * 1000) / 1000,
                urgencyLevel: urgencyInfo.level,
                urgencyKeyword: urgencyInfo.keyword,
                taskAlignment: Math.round(taskAlignment * 1000) / 1000,
                cognitiveBandwidth: Math.round(bandwidthModifier * 1000) / 1000,
            },
            explanation: this.generateExplanation(message, {
                senderImportance, urgencyInfo, taskAlignment, bandwidthModifier, interactionWeight
            }),
        };
    }

    generateExplanation(message, factors) {
        const reasons = [];
        if (factors.senderImportance >= 0.8) reasons.push(`High-priority sender (${message.senderRole})`);
        else if (factors.senderImportance >= 0.5) reasons.push(`Medium-priority sender (${message.senderRole})`);
        else reasons.push(`Low-priority sender (${message.senderRole})`);

        if (factors.urgencyInfo.level === 'critical') reasons.push(`CRITICAL urgency detected: "${factors.urgencyInfo.keyword}"`);
        else if (factors.urgencyInfo.level === 'high') reasons.push(`High urgency detected: "${factors.urgencyInfo.keyword}"`);

        if (factors.taskAlignment >= 0.5) reasons.push('Aligns with current project focus');
        if (factors.interactionWeight >= 0.7) reasons.push('Frequent interaction history');
        if (factors.bandwidthModifier < 1.0) reasons.push(`Score moderated by high cognitive load (×${factors.bandwidthModifier})`);

        return reasons.join(' • ');
    }

    rankMessages(messages, cognitiveLoad = 'medium') {
        return messages
            .map(msg => ({ ...msg, scoring: this.scoreMessage(msg, cognitiveLoad) }))
            .sort((a, b) => b.scoring.finalScore - a.scoring.finalScore);
    }
}
