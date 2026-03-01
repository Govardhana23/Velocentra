// ReplyGenerator.js
// Context-aware reply generation with role-based tone adaptation

const REPLY_TEMPLATES = {
    meeting: {
        hr: (msg, ctx) => `Dear ${msg.senderName},\n\nThank you for the meeting invitation regarding "${msg.subject}". I have reviewed the agenda and would like to confirm my attendance.\n\n${ctx.pastContext ? `Following up on our previous discussion about ${ctx.pastContext}, ` : ''}I believe this meeting will be productive. Please let me know if there are any preparatory materials I should review beforehand.\n\nI have noted the scheduled time and will ensure my availability. Should any conflicts arise, I will notify you at the earliest opportunity.\n\nBest regards`,
        manager: (msg, ctx) => `Hi ${msg.senderName},\n\nConfirmed for the meeting on "${msg.subject}".${ctx.pastContext ? ` Building on our ${ctx.pastContext} discussion — ` : ' '}I'll come prepared with the latest metrics and action items.\n\nKey points I'd like to cover:\n• Current sprint progress\n• Blockers requiring your input\n• Timeline alignment\n\nLet me know if we need to adjust scope.`,
        colleague: (msg, ctx) => `Hey ${msg.senderName}! 👋\n\nSounds good — I'm in for the meeting on "${msg.subject}"!${ctx.pastContext ? ` Great that we're following up on the ${ctx.pastContext} stuff.` : ''}\n\nI'll bring my notes and we can hash things out together. See you there! 🙌`,
    },
    task: {
        hr: (msg, ctx) => `Dear ${msg.senderName},\n\nThank you for bringing this task to my attention regarding "${msg.subject}". I acknowledge receipt and will prioritize accordingly.\n\n${ctx.pastContext ? `In reference to our prior correspondence about ${ctx.pastContext}, ` : ''}I will provide a comprehensive update upon completion. Please do not hesitate to reach out should you require interim progress reports.\n\nRespectfully`,
        manager: (msg, ctx) => `Hi ${msg.senderName},\n\nAcknowledged — "${msg.subject}" is now on my radar.${ctx.pastContext ? ` This ties into the ${ctx.pastContext} initiative.` : ''}\n\nEstimated completion: End of day.\nDependencies: None identified.\nRisk: Low.\n\nI'll flag immediately if anything changes.`,
        colleague: (msg, ctx) => `Hey ${msg.senderName}!\n\nGot it — I'll take care of "${msg.subject}"!${ctx.pastContext ? ` I remember we talked about ${ctx.pastContext}, so this should connect nicely.` : ''}\n\nI'll keep you posted on progress. Let me know if anything changes on your end! 😊`,
    },
    approval: {
        hr: (msg, ctx) => `Dear ${msg.senderName},\n\nI have reviewed the approval request regarding "${msg.subject}" and wish to provide my formal response.\n\n${ctx.pastContext ? `Considering our previous discussions on ${ctx.pastContext}, ` : ''}I have carefully evaluated all relevant factors and compliance requirements. My recommendation is to proceed, pending any additional documentation that may be required.\n\nPlease confirm the next steps in the approval workflow.\n\nKind regards`,
        manager: (msg, ctx) => `Hi ${msg.senderName},\n\nRe: "${msg.subject}" — reviewed and approved from my end.${ctx.pastContext ? ` Consistent with our ${ctx.pastContext} direction.` : ''}\n\nRationale:\n• Aligns with Q4 objectives\n• Resource impact is manageable\n• ROI projections are favorable\n\nMoving forward unless you have concerns.`,
        colleague: (msg, ctx) => `Hey ${msg.senderName}!\n\nLooked at "${msg.subject}" — looks great to me! 👍${ctx.pastContext ? ` Especially how it builds on the ${ctx.pastContext} work.` : ''}\n\nLet me know if you need anything else from my side. Happy to help!`,
    },
    general: {
        hr: (msg, ctx) => `Dear ${msg.senderName},\n\nThank you for your message regarding "${msg.subject}". I appreciate you keeping me informed.\n\n${ctx.pastContext ? `As discussed previously regarding ${ctx.pastContext}, ` : ''}I will review the details and respond with any necessary follow-up actions within the appropriate timeframe.\n\nPlease don't hesitate to reach out if you require any additional information.\n\nBest regards`,
        manager: (msg, ctx) => `Hi ${msg.senderName},\n\nThanks for the update on "${msg.subject}".${ctx.pastContext ? ` Noted in context of ${ctx.pastContext}.` : ''}\n\nI'll factor this into current planning. Will follow up if I need additional context or if this impacts our timeline.\n\nThanks.`,
        colleague: (msg, ctx) => `Hey ${msg.senderName}!\n\nThanks for the heads up about "${msg.subject}"!${ctx.pastContext ? ` Good that we're staying on top of the ${ctx.pastContext} work.` : ''}\n\nLet me know if there's anything I can do to help out. Always happy to jam on this! 💪`,
    },
};

const TONE_PROFILES = {
    hr: { tone: 'Formal', assertiveness: 'Measured', lengthLabel: 'Detailed', formality: 0.95 },
    manager: { tone: 'Strategic', assertiveness: 'High', lengthLabel: 'Concise', formality: 0.75 },
    colleague: { tone: 'Friendly', assertiveness: 'Medium', lengthLabel: 'Casual', formality: 0.35 },
};

export class ReplyGenerator {
    constructor() {
        this.conversationContexts = {};
    }

    setConversationContexts(contexts) {
        this.conversationContexts = contexts;
    }

    getCategory(message) {
        const type = (message.category || '').toLowerCase();
        if (['meeting', 'meeting_invite', 'calendar'].includes(type)) return 'meeting';
        if (['task', 'assignment', 'action_item'].includes(type)) return 'task';
        if (['approval', 'request', 'permission'].includes(type)) return 'approval';
        return 'general';
    }

    generateReplies(message) {
        const category = this.getCategory(message);
        const templates = REPLY_TEMPLATES[category] || REPLY_TEMPLATES.general;
        const ctx = {
            pastContext: this.conversationContexts[message.senderId] || message.pastContext || null,
        };

        return {
            hr: {
                text: templates.hr(message, ctx),
                profile: TONE_PROFILES.hr,
                role: 'HR',
                wordCount: templates.hr(message, ctx).split(/\s+/).length,
            },
            manager: {
                text: templates.manager(message, ctx),
                profile: TONE_PROFILES.manager,
                role: 'Manager',
                wordCount: templates.manager(message, ctx).split(/\s+/).length,
            },
            colleague: {
                text: templates.colleague(message, ctx),
                profile: TONE_PROFILES.colleague,
                role: 'Colleague',
                wordCount: templates.colleague(message, ctx).split(/\s+/).length,
            },
        };
    }
}
