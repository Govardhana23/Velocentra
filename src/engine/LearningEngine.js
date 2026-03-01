// LearningEngine.js
// On-device behavioral learning simulation with localStorage persistence

const STORAGE_KEY = 'velocentra_learning_data';

export class LearningEngine {
    constructor() {
        this.behaviorData = this.loadFromStorage() || this.getDefaultData();
        this.weightHistory = this.behaviorData.weightHistory || [];
        this.epoch = this.behaviorData.epoch || 0;
    }

    getDefaultData() {
        return {
            epoch: 0,
            responseTimeBySender: {},
            peakFocusHours: new Array(24).fill(0),
            stressThreshold: 0.7,
            currentStress: 0.3,
            ignorePatterns: {},
            senderWeightAdjustments: {},
            weightHistory: [],
            dailyMetrics: [],
            interactionCounts: {},
        };
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.behaviorData));
        } catch { /* localStorage full or unavailable */ }
    }

    recordInteraction(senderId, senderRole, responseTimeMs, wasIgnored = false) {
        // Track response times
        if (!this.behaviorData.responseTimeBySender[senderId]) {
            this.behaviorData.responseTimeBySender[senderId] = { times: [], role: senderRole, avg: 0 };
        }
        const senderData = this.behaviorData.responseTimeBySender[senderId];
        senderData.times.push(responseTimeMs);
        if (senderData.times.length > 50) senderData.times.shift();
        senderData.avg = senderData.times.reduce((a, b) => a + b, 0) / senderData.times.length;

        // Track ignore patterns
        if (!this.behaviorData.ignorePatterns[senderId]) {
            this.behaviorData.ignorePatterns[senderId] = { total: 0, ignored: 0, rate: 0 };
        }
        this.behaviorData.ignorePatterns[senderId].total++;
        if (wasIgnored) this.behaviorData.ignorePatterns[senderId].ignored++;
        this.behaviorData.ignorePatterns[senderId].rate =
            this.behaviorData.ignorePatterns[senderId].ignored / this.behaviorData.ignorePatterns[senderId].total;

        // Track interaction counts
        if (!this.behaviorData.interactionCounts[senderId]) {
            this.behaviorData.interactionCounts[senderId] = 0;
        }
        this.behaviorData.interactionCounts[senderId]++;

        // Track focus hours
        const hour = new Date().getHours();
        this.behaviorData.peakFocusHours[hour]++;

        this.saveToStorage();
    }

    simulateTimeStep(messages, currentStress) {
        this.epoch++;
        this.behaviorData.epoch = this.epoch;
        this.behaviorData.currentStress = currentStress;

        // Simulate interactions for each message
        messages.forEach(msg => {
            const responseTime = this.simulateResponseTime(msg.senderRole, currentStress);
            const wasIgnored = this.simulateIgnore(msg.senderRole, msg.scoring?.finalScore || 0.5, currentStress);
            this.recordInteraction(msg.senderId, msg.senderRole, responseTime, wasIgnored);
        });

        // Update sender weight adjustments based on learned behavior
        this.updateWeightAdjustments();

        // Record weight history snapshot
        this.recordWeightSnapshot();

        // Record daily metrics
        this.recordDailyMetrics(messages, currentStress);

        this.saveToStorage();
        return this.getAdaptedWeights();
    }

    simulateResponseTime(senderRole, stress) {
        const baseTimes = { ceo: 30, manager: 120, hr: 300, lead: 180, colleague: 600, marketing: 1800, system: 3600, external: 2400 };
        const base = baseTimes[senderRole] || 900;
        const stressFactor = 1 + stress * 2;
        const variance = (Math.random() - 0.5) * base * 0.5;
        return Math.max(10, base * stressFactor + variance);
    }

    simulateIgnore(senderRole, score, stress) {
        const ignoreProb = (1 - score) * 0.3 + stress * 0.2;
        return Math.random() < ignoreProb;
    }

    updateWeightAdjustments() {
        const adjustments = {};
        for (const [senderId, pattern] of Object.entries(this.behaviorData.ignorePatterns)) {
            const senderData = this.behaviorData.responseTimeBySender[senderId];
            if (!senderData) continue;

            let adjustment = 0;
            // If frequently ignored, reduce importance
            if (pattern.rate > 0.5) adjustment -= 0.1;
            else if (pattern.rate > 0.3) adjustment -= 0.05;
            // If responded to quickly, increase importance
            if (senderData.avg < 120) adjustment += 0.1;
            else if (senderData.avg < 300) adjustment += 0.05;
            // Frequent interactions boost importance
            const count = this.behaviorData.interactionCounts[senderId] || 0;
            if (count > 15) adjustment += 0.05;

            adjustments[senderData.role] = (adjustments[senderData.role] || 0) + adjustment;
        }

        this.behaviorData.senderWeightAdjustments = adjustments;
    }

    recordWeightSnapshot() {
        const snapshot = {
            epoch: this.epoch,
            timestamp: Date.now(),
            weights: { ...this.getAdaptedWeights() },
            stress: this.behaviorData.currentStress,
        };
        this.weightHistory.push(snapshot);
        this.behaviorData.weightHistory = this.weightHistory;
        if (this.weightHistory.length > 100) this.weightHistory.shift();
    }

    recordDailyMetrics(messages, stress) {
        this.behaviorData.dailyMetrics.push({
            epoch: this.epoch,
            messageCount: messages.length,
            avgScore: messages.reduce((s, m) => s + (m.scoring?.finalScore || 0.5), 0) / Math.max(1, messages.length),
            stress,
            timestamp: Date.now(),
        });
        if (this.behaviorData.dailyMetrics.length > 50) this.behaviorData.dailyMetrics.shift();
    }

    getAdaptedWeights() {
        const base = { ceo: 1.0, manager: 0.92, hr: 0.82, lead: 0.78, colleague: 0.55, marketing: 0.30, system: 0.20, external: 0.15 };
        const adaptations = this.behaviorData.senderWeightAdjustments;
        const adapted = {};
        for (const [role, weight] of Object.entries(base)) {
            adapted[role] = Math.min(1.0, Math.max(0.05, weight + (adaptations[role] || 0)));
        }
        return adapted;
    }

    getWeightHistory() {
        return this.weightHistory;
    }

    getPeakFocusHours() {
        return this.behaviorData.peakFocusHours;
    }

    getResponseTimeSummary() {
        const summary = {};
        for (const [senderId, data] of Object.entries(this.behaviorData.responseTimeBySender)) {
            summary[senderId] = { role: data.role, avgResponseTimeSec: Math.round(data.avg), interactions: data.times.length };
        }
        return summary;
    }

    getIgnorePatterns() {
        return this.behaviorData.ignorePatterns;
    }

    getDailyMetrics() {
        return this.behaviorData.dailyMetrics;
    }

    getStressLevel() {
        return this.behaviorData.currentStress;
    }

    reset() {
        this.behaviorData = this.getDefaultData();
        this.weightHistory = [];
        this.epoch = 0;
        localStorage.removeItem(STORAGE_KEY);
    }
}
