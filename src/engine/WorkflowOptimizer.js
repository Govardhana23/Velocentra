// WorkflowOptimizer.js
// Proactive workflow optimization — triggers automatically on overload

const SUGGESTION_TYPES = {
    RESCHEDULE_MEETING: 'reschedule_meeting',
    ASYNC_SUMMARY: 'async_summary',
    PRE_DRAFT_REPLY: 'pre_draft_reply',
    BATCH_TASKS: 'batch_tasks',
    DELEGATE_TASK: 'delegate_task',
    BREAK_REMINDER: 'break_reminder',
    FOCUS_BLOCK: 'focus_block',
};

const MEETING_MESSAGES = ['meeting', 'meet', 'sync', 'standup', 'call', 'huddle', 'catch up', 'check-in'];
const TASK_KEYWORDS = ['task', 'todo', 'action item', 'deliverable', 'implement', 'fix', 'update'];

export class WorkflowOptimizer {
    constructor() {
        this.suggestions = [];
        this.dismissedSuggestions = new Set();
        this.acceptedSuggestions = [];
        this.overloadThreshold = {
            messageCount: 12,
            cognitiveLoad: 'high',
        };
    }

    analyze(messages, cognitiveLoad, stressLevel = 0.5) {
        this.suggestions = [];

        const isOverloaded = this.detectOverload(messages, cognitiveLoad, stressLevel);

        if (isOverloaded) {
            this.suggestMeetingReschedule(messages);
            this.suggestAsyncConversion(messages);
            this.suggestPreDraftReplies(messages);
            this.suggestTaskBatching(messages);
            this.suggestBreak(stressLevel);
            this.suggestFocusBlock(cognitiveLoad);
        } else if (cognitiveLoad === 'medium') {
            // Lighter suggestions for medium load
            this.suggestTaskBatching(messages);
            if (stressLevel > 0.5) this.suggestBreak(stressLevel);
        }

        // Filter out dismissed suggestions
        this.suggestions = this.suggestions.filter(s => !this.dismissedSuggestions.has(s.id));

        return this.suggestions;
    }

    detectOverload(messages, cognitiveLoad, stressLevel) {
        const messagePressure = messages.length >= this.overloadThreshold.messageCount;
        const loadPressure = cognitiveLoad === 'high';
        const stressPressure = stressLevel >= 0.7;
        return (messagePressure && loadPressure) || stressPressure || (messagePressure && stressPressure);
    }

    suggestMeetingReschedule(messages) {
        const meetingMsgs = messages.filter(m => {
            const text = (m.subject + ' ' + m.body + ' ' + (m.category || '')).toLowerCase();
            return MEETING_MESSAGES.some(kw => text.includes(kw));
        });

        const lowPriorityMeetings = meetingMsgs.filter(m => (m.scoring?.finalScore || 0.5) < 0.5);

        lowPriorityMeetings.forEach((m, i) => {
            this.suggestions.push({
                id: `reschedule_${m.id}`,
                type: SUGGESTION_TYPES.RESCHEDULE_MEETING,
                icon: '📅',
                title: `Reschedule: "${m.subject}"`,
                description: `This meeting from ${m.senderName} (${m.senderRole}) has low priority (${((m.scoring?.finalScore || 0.5) * 100).toFixed(0)}%). Consider rescheduling to a less congested time.`,
                impact: 0.7 + i * 0.1,
                relatedMessageId: m.id,
                actionLabel: 'Reschedule',
            });
        });
    }

    suggestAsyncConversion(messages) {
        const meetingMsgs = messages.filter(m => {
            const text = (m.subject + ' ' + m.body + ' ' + (m.category || '')).toLowerCase();
            return MEETING_MESSAGES.some(kw => text.includes(kw));
        });

        const convertible = meetingMsgs.filter(m => {
            const score = m.scoring?.finalScore || 0.5;
            return score < 0.6 && score >= 0.3;
        });

        convertible.slice(0, 2).forEach(m => {
            this.suggestions.push({
                id: `async_${m.id}`,
                type: SUGGESTION_TYPES.ASYNC_SUMMARY,
                icon: '📝',
                title: `Convert to Async: "${m.subject}"`,
                description: `This meeting could be replaced with an async summary. Saves ~30 min and reduces context-switching overhead.`,
                impact: 0.8,
                relatedMessageId: m.id,
                actionLabel: 'Convert',
            });
        });
    }

    suggestPreDraftReplies(messages) {
        const needsReply = messages.filter(m => {
            const cat = (m.category || '').toLowerCase();
            return ['task', 'approval', 'question', 'request'].includes(cat);
        });

        if (needsReply.length >= 3) {
            this.suggestions.push({
                id: `predraft_batch_${Date.now()}`,
                type: SUGGESTION_TYPES.PRE_DRAFT_REPLY,
                icon: '✍️',
                title: `Pre-draft ${needsReply.length} Replies`,
                description: `${needsReply.length} messages require responses. Pre-drafting replies now can save ${needsReply.length * 3} minutes of composition time.`,
                impact: 0.75,
                actionLabel: 'Draft All',
            });
        }
    }

    suggestTaskBatching(messages) {
        const taskMsgs = messages.filter(m => {
            const text = (m.subject + ' ' + m.body + ' ' + (m.category || '')).toLowerCase();
            return TASK_KEYWORDS.some(kw => text.includes(kw));
        });

        if (taskMsgs.length >= 3) {
            const categories = {};
            taskMsgs.forEach(m => {
                const cat = m.category || 'general';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(m);
            });

            for (const [cat, msgs] of Object.entries(categories)) {
                if (msgs.length >= 2) {
                    this.suggestions.push({
                        id: `batch_${cat}_${Date.now()}`,
                        type: SUGGESTION_TYPES.BATCH_TASKS,
                        icon: '📦',
                        title: `Batch ${msgs.length} ${cat} Tasks`,
                        description: `Group these related tasks together to reduce context-switching. Estimated time saved: ${msgs.length * 5} min.`,
                        impact: 0.65,
                        actionLabel: 'Batch',
                    });
                }
            }
        }
    }

    suggestBreak(stressLevel) {
        if (stressLevel >= 0.7) {
            this.suggestions.push({
                id: `break_${Date.now()}`,
                type: SUGGESTION_TYPES.BREAK_REMINDER,
                icon: '🧘',
                title: 'Take a Focus Break',
                description: `Stress level is at ${(stressLevel * 100).toFixed(0)}%. A 10-minute break can reduce cognitive fatigue by ~25% and improve decision quality.`,
                impact: 0.9,
                actionLabel: 'Start Break',
            });
        }
    }

    suggestFocusBlock(cognitiveLoad) {
        if (cognitiveLoad === 'high') {
            this.suggestions.push({
                id: `focus_${Date.now()}`,
                type: SUGGESTION_TYPES.FOCUS_BLOCK,
                icon: '🎯',
                title: 'Enable Deep Work Block',
                description: 'Your cognitive load is elevated. Consider enabling Zen Mode for 45 minutes to complete critical tasks without interruption.',
                impact: 0.85,
                actionLabel: 'Enable Zen',
            });
        }
    }

    acceptSuggestion(suggestionId) {
        const suggestion = this.suggestions.find(s => s.id === suggestionId);
        if (suggestion) {
            this.acceptedSuggestions.push({ ...suggestion, acceptedAt: Date.now() });
            this.suggestions = this.suggestions.filter(s => s.id !== suggestionId);
        }
        return suggestion;
    }

    dismissSuggestion(suggestionId) {
        this.dismissedSuggestions.add(suggestionId);
        this.suggestions = this.suggestions.filter(s => s.id !== suggestionId);
    }

    getSuggestions() {
        return this.suggestions;
    }

    getAcceptedSuggestions() {
        return this.acceptedSuggestions;
    }
}
