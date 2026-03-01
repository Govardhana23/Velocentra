// DistractionFilter.js
// Contextual distraction filtering for Zen Mode (Deep Work Mode)

export class DistractionFilter {
    constructor() {
        this.isZenMode = false;
        this.filterLog = [];
        this.thresholds = {
            allow: 0.7,   // Score >= 0.7 → immediate delivery
            batch: 0.4,   // 0.4 <= score < 0.7 → batched
            // < 0.4 → delayed
        };
        this.batchedMessages = [];
        this.delayedMessages = [];
        this.batchInterval = 15; // minutes in simulation
        this.lastBatchTime = Date.now();
    }

    enableZenMode() {
        this.isZenMode = true;
        this.filterLog = [];
        this.batchedMessages = [];
        this.delayedMessages = [];
        this.lastBatchTime = Date.now();
        return { status: 'zen_mode_active', message: 'Deep Work Mode activated. Only critical messages will pass through.' };
    }

    disableZenMode() {
        this.isZenMode = false;
        const released = {
            batched: [...this.batchedMessages],
            delayed: [...this.delayedMessages],
        };
        this.batchedMessages = [];
        this.delayedMessages = [];
        return { status: 'zen_mode_deactivated', released };
    }

    filterMessage(message, score, breakdown) {
        if (!this.isZenMode) {
            return { action: 'allow', reason: 'Normal mode — all messages delivered', category: 'normal' };
        }

        let action, reason, category;

        if (score >= this.thresholds.allow) {
            action = 'allow';
            category = 'immediate';
            reason = this.buildAllowReason(message, score, breakdown);
        } else if (score >= this.thresholds.batch) {
            action = 'batch';
            category = 'batched';
            reason = this.buildBatchReason(message, score, breakdown);
            this.batchedMessages.push({ ...message, score, filteredAt: new Date().toISOString() });
        } else {
            action = 'delay';
            category = 'delayed';
            reason = this.buildDelayReason(message, score, breakdown);
            this.delayedMessages.push({ ...message, score, filteredAt: new Date().toISOString() });
        }

        const logEntry = {
            messageId: message.id,
            sender: message.senderName,
            senderRole: message.senderRole,
            subject: message.subject,
            score: Math.round(score * 1000) / 1000,
            action,
            category,
            reason,
            timestamp: new Date().toISOString(),
        };

        this.filterLog.push(logEntry);
        return logEntry;
    }

    buildAllowReason(message, score, breakdown) {
        const reasons = [`Score ${(score * 100).toFixed(0)}% exceeds threshold`];
        if (breakdown.urgencyLevel === 'critical') reasons.push('Critical urgency detected');
        if (breakdown.senderImportance >= 0.8) reasons.push(`${message.senderRole} — high-priority sender`);
        if (breakdown.taskAlignment >= 0.5) reasons.push('Relevant to current project');
        return `ALLOWED: ${reasons.join('. ')}.`;
    }

    buildBatchReason(message, score, breakdown) {
        const reasons = [`Score ${(score * 100).toFixed(0)}% — moderate priority`];
        if (breakdown.urgencyLevel === 'medium') reasons.push('Medium urgency — not time-critical');
        reasons.push('Will be delivered in next batch review');
        return `BATCHED: ${reasons.join('. ')}.`;
    }

    buildDelayReason(message, score, breakdown) {
        const reasons = [`Score ${(score * 100).toFixed(0)}% — below batch threshold`];
        if (breakdown.senderImportance < 0.4) reasons.push(`${message.senderRole} — low-priority sender`);
        if (breakdown.urgencyLevel === 'low') reasons.push('No urgency detected');
        reasons.push('Held until Deep Work Mode ends');
        return `DELAYED: ${reasons.join('. ')}.`;
    }

    getFilterStats() {
        return {
            total: this.filterLog.length,
            allowed: this.filterLog.filter(l => l.action === 'allow').length,
            batched: this.batchedMessages.length,
            delayed: this.delayedMessages.length,
            log: this.filterLog,
        };
    }

    getBatchedMessages() {
        return this.batchedMessages;
    }

    getDelayedMessages() {
        return this.delayedMessages;
    }

    releaseBatch() {
        const batch = [...this.batchedMessages];
        this.batchedMessages = [];
        this.lastBatchTime = Date.now();
        return batch;
    }
}
