// messages.js — 55+ simulated messages with diverse sender roles, urgency levels, and categories

export const senders = {
    s1: { id: 's1', name: 'Arjun Mehta', role: 'manager', department: 'Engineering', avatar: '👨‍💼' },
    s2: { id: 's2', name: 'Priya Sharma', role: 'hr', department: 'Human Resources', avatar: '👩‍💼' },
    s3: { id: 's3', name: 'Rahul Gupta', role: 'colleague', department: 'Engineering', avatar: '👨‍💻' },
    s4: { id: 's4', name: 'Ananya Reddy', role: 'lead', department: 'Product', avatar: '👩‍🔬' },
    s5: { id: 's5', name: 'Marketing Team', role: 'marketing', department: 'Marketing', avatar: '📢' },
    s6: { id: 's6', name: 'System Monitor', role: 'system', department: 'DevOps', avatar: '🤖' },
    s7: { id: 's7', name: 'External Client', role: 'external', department: 'External', avatar: '🏢' },
    s8: { id: 's8', name: 'Vikram Singh', role: 'ceo', department: 'Executive', avatar: '👑' },
    s9: { id: 's9', name: 'Sneha Patel', role: 'colleague', department: 'Design', avatar: '🎨' },
    s10: { id: 's10', name: 'DevOps Bot', role: 'system', department: 'DevOps', avatar: '⚙️' },
    s11: { id: 's11', name: 'Kavitha Nair', role: 'hr', department: 'Human Resources', avatar: '📋' },
    s12: { id: 's12', name: 'Newsletter', role: 'marketing', department: 'Marketing', avatar: '📰' },
};

export const interactionHistory = {
    s1: { responseRate: 0.95, avgResponseTime: 60, frequency: 25 },
    s2: { responseRate: 0.8, avgResponseTime: 180, frequency: 8 },
    s3: { responseRate: 0.9, avgResponseTime: 120, frequency: 30 },
    s4: { responseRate: 0.88, avgResponseTime: 90, frequency: 18 },
    s5: { responseRate: 0.3, avgResponseTime: 1200, frequency: 5 },
    s6: { responseRate: 0.4, avgResponseTime: 600, frequency: 12 },
    s7: { responseRate: 0.7, avgResponseTime: 300, frequency: 4 },
    s8: { responseRate: 0.99, avgResponseTime: 30, frequency: 6 },
    s9: { responseRate: 0.85, avgResponseTime: 150, frequency: 20 },
    s10: { responseRate: 0.2, avgResponseTime: 900, frequency: 15 },
    s11: { responseRate: 0.75, avgResponseTime: 240, frequency: 6 },
    s12: { responseRate: 0.1, avgResponseTime: 3600, frequency: 3 },
};

export const conversationContexts = {
    s1: 'sprint planning and resource allocation',
    s2: 'leave policy and performance review cycle',
    s3: 'API refactoring and code review',
    s4: 'product roadmap and feature prioritization',
    s5: 'Q4 campaign analytics',
    s7: 'contract renewal negotiations',
    s8: 'company strategy and quarterly goals',
    s9: 'UI component redesign',
};

let nextId = 1;
const msg = (senderId, subject, body, urgency, category, minutesAgo, pastContext) => ({
    id: `msg_${nextId++}`,
    senderId,
    senderName: senders[senderId].name,
    senderRole: senders[senderId].role,
    senderAvatar: senders[senderId].avatar,
    department: senders[senderId].department,
    subject,
    body,
    urgency,
    category,
    timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
    pastContext: pastContext || conversationContexts[senderId] || null,
    read: false,
    replied: false,
});

export const initialMessages = [
    // CRITICAL urgency
    msg('s8', 'Board meeting prep — need your input immediately', 'We have the board presentation in 2 hours. I need the product launch metrics and progress update right now. This is critical.', 'critical', 'task', 5, 'quarterly goals'),
    msg('s6', 'CRITICAL: Production server CPU at 98%', 'Alert: Production cluster node-3 CPU usage has exceeded 98%. Auto-scaling failed. Immediately investigate and resolve. Outage risk HIGH.', 'critical', 'emergency', 2),
    msg('s1', 'Urgent: Sprint deadline moved to today', 'Leadership just moved the sprint deadline to today EOD. We need to immediately prioritize remaining tasks and drop non-essentials. Let\'s sync ASAP.', 'critical', 'task', 8, 'sprint planning'),

    // HIGH urgency
    msg('s1', 'Release blockers — need your review', 'There are 3 blocking PRs that need your review before we can deploy the release branch. This is priority — deadline is today.', 'high', 'approval', 15, 'sprint planning'),
    msg('s4', 'Product launch checklist — missing items', 'The product launch is scheduled for Friday. We\'re missing the feature flag configurations and the rollback plan. Can you handle these today?', 'high', 'task', 20, 'product roadmap'),
    msg('s2', 'IMPORTANT: Benefits enrollment deadline tomorrow', 'This is a reminder that the annual benefits enrollment window closes tomorrow at 5 PM. Please ensure you have completed your selections. This deadline cannot be extended.', 'high', 'approval', 25),
    msg('s7', 'Contract renewal — need response by EOD', 'Hi, our current contract expires this week. We need your signed renewal document by end of day today to avoid service interruption. Please prioritize.', 'high', 'approval', 30, 'contract renewal'),
    msg('s3', 'Bug in payment module — blocking QA', 'Found a critical bug in the payment processing module. QA is completely blocked. The discount calculation returns NaN for percentage-based discounts. Need fix ASAP.', 'high', 'task', 12, 'API refactoring'),
    msg('s8', 'Strategy alignment check', 'Quick check — are we still aligned on the Q4 product priorities? I want to confirm before my investor call this afternoon.', 'high', 'question', 35, 'company strategy'),

    // MEDIUM urgency
    msg('s1', 'Team sync — tomorrow 10 AM', 'Scheduling our weekly team sync for tomorrow at 10 AM. Agenda: sprint review, upcoming milestones, and resource planning. Please come prepared with your updates.', 'medium', 'meeting', 45, 'resource allocation'),
    msg('s4', 'Feature prioritization discussion', 'Can we meet this week to review the feature backlog? I want to reprioritize based on the latest customer feedback data. Suggest Tuesday or Wednesday.', 'medium', 'meeting', 60, 'feature prioritization'),
    msg('s3', 'Code review — auth module refactor', 'I\'ve pushed the auth module refactor to the feature branch. When you get a chance this week, could you do a review? No rush, but would be good to get it merged before next sprint.', 'medium', 'task', 90, 'code review'),
    msg('s9', 'Design system update — new component library', 'Hey! I\'ve finished the new component library designs. The updated design system includes revised color tokens, spacing scale, and new card variants. Review when you can.', 'medium', 'task', 75, 'UI redesign'),
    msg('s2', 'Performance review — self-assessment reminder', 'Reminder: Self-assessment forms for the upcoming performance review cycle are due by next Friday. Please begin working on yours soon.', 'medium', 'task', 120),
    msg('s4', 'Roadmap update — Q1 planning', 'I\'ve updated the product roadmap document with our Q1 initiatives. Please review and add any engineering feasibility notes by this week. Link in the shared drive.', 'medium', 'task', 100, 'product roadmap'),
    msg('s1', 'Architecture review for microservices migration', 'We need to discuss the microservices migration architecture. I\'ve drafted an initial proposal. Let\'s schedule a review session this week.', 'medium', 'meeting', 110, 'sprint planning'),
    msg('s3', 'Database migration script ready', 'The migration script for the new schema is ready in the staging branch. I\'ve tested it against a copy of prod data. Can you verify the rollback procedure?', 'medium', 'task', 55, 'API refactoring'),
    msg('s7', 'Partnership proposal — follow up', 'Following up on our partnership discussion from last month. We\'ve prepared a revised proposal with the updated terms. Would appreciate your review this week.', 'medium', 'approval', 130, 'contract renewal'),

    // LOW urgency
    msg('s5', 'Q4 Marketing Campaign Results', 'Hi team! Here are the Q4 campaign results: 23% increase in engagement, 15% boost in lead generation. Full report attached for your review. No action needed — FYI only.', 'low', 'fyi', 180),
    msg('s12', 'Weekly Tech Newsletter — Issue #42', 'This week: AI trends in productivity tools, new JavaScript frameworks, and 5 tips for better code reviews. Read when you get a chance.', 'low', 'fyi', 200),
    msg('s10', 'System: Weekly backup completed successfully', 'Automated weekly backup completed at 03:00 AM. All databases backed up. Backup size: 2.3TB. No issues detected.', 'low', 'fyi', 240),
    msg('s5', 'Social media calendar for next month', 'Hey! The social media content calendar for next month is ready for review. No rush — optional feedback welcome by next week.', 'low', 'fyi', 300),
    msg('s6', 'Info: SSL certificate renewal in 30 days', 'FYI: The SSL certificate for api.velocentra.io will expire in 30 days. Auto-renewal is configured. No action required unless auto-renewal fails.', 'low', 'fyi', 270),
    msg('s9', 'Inspiration board — UI trends 2026', 'Put together an inspiration board with the latest UI trends. Some really cool glassmorphism and micro-animation examples. Check it when you get a chance! 🎨', 'low', 'fyi', 350),
    msg('s12', 'Company Hackathon — Registration Open', 'The annual company hackathon is next month! Registration is now open. Theme: "AI for Good." Optional but fun. Sign up if interested.', 'low', 'social', 400),
    msg('s10', 'Log rotation completed', 'Automated log rotation completed. 1.2GB of old logs archived. Current log directory size: 450MB.', 'low', 'fyi', 320),

    // Additional MEDIUM messages for variety
    msg('s1', 'Sprint velocity report', 'This sprint\'s velocity is trending 15% above estimate. Good work on the API milestones. Let\'s discuss sustainability in our next retro.', 'medium', 'fyi', 85, 'sprint planning'),
    msg('s2', 'New remote work policy update', 'HR has updated the remote work policy effective next month. Key changes: 3 days minimum in-office, flexible Friday schedule. Review the updated policy document.', 'medium', 'fyi', 150),
    msg('s4', 'Customer feedback summary — Sprint 14', 'Compiled customer feedback from Sprint 14 feature release. Overall positive. Top request: better dashboard customization. Details in the attached summary.', 'medium', 'fyi', 95, 'feature prioritization'),
    msg('s3', 'Pair programming session — Wednesday?', 'Want to do a pair programming session on the caching layer this Wednesday? I think we can knock it out in 2-3 hours if we work together.', 'medium', 'meeting', 140, 'code review'),

    // More LOW
    msg('s5', 'Brand guidelines v2.0 released', 'The updated brand guidelines are live. New color palette, updated logo usage rules, and refreshed typography. Optional read for the team.', 'low', 'fyi', 360),
    msg('s10', 'Disk usage alert — 65% on staging', 'Staging server disk usage has reached 65%. No immediate action needed, but consider cleaning up old deployment artifacts when convenient.', 'low', 'fyi', 280),
    msg('s12', 'Wellness Wednesday: Mindfulness Workshop', 'Join us this Wednesday for a 30-minute mindfulness workshop. Optional. Link to join: meet.velocentra.io/wellness. No RSVP needed.', 'low', 'social', 420),

    // Additional HIGH
    msg('s1', 'Client demo preparation — need assets', 'We have a key client demo on Thursday. I need the updated product screenshots, performance benchmarks, and the deployment architecture diagram. Priority!', 'high', 'task', 40, 'sprint planning'),
    msg('s4', 'Feature flag misconfiguration — users affected', 'The feature flag for the new dashboard is turned on for 100% of users instead of the planned 10%. We need to fix this today — some users are reporting issues.', 'high', 'task', 18, 'product roadmap'),

    // More MEDIUM
    msg('s9', 'Accessibility audit results', 'Completed the accessibility audit on the main dashboard. Found 12 issues: 3 critical (contrast ratios), 5 moderate (missing ARIA labels), 4 minor. Report attached.', 'medium', 'task', 70, 'UI redesign'),
    msg('s3', 'Test coverage improvement plan', 'I\'ve mapped out a plan to increase test coverage from 67% to 85%. It\'ll take about 2 sprints. Want to review the plan and discuss priorities?', 'medium', 'task', 115, 'code review'),
    msg('s1', 'Cross-team dependency meeting', 'The platform team needs to align on the shared component library. Cross-team meeting proposed for Friday. Please confirm your availability.', 'medium', 'meeting', 160, 'resource allocation'),
    msg('s7', 'Technical integration questions', 'We have a few technical questions about the API integration. Can we schedule a 30-minute call this week to discuss the authentication flow and rate limits?', 'medium', 'meeting', 170, 'contract renewal'),
    msg('s2', 'Training budget approval request', 'Your team\'s training budget request for Q1 (AWS certifications) has been submitted for approval. Expected response within 5 business days.', 'medium', 'approval', 180),

    // More CRITICAL
    msg('s6', 'ALERT: Database connection pool exhausted', 'Emergency: All database connections are in use. New requests are being queued. Application response time has degraded to 15s. Immediately investigate connection leaks.', 'critical', 'emergency', 3),

    // Extra variety
    msg('s9', 'Prototype ready for user testing', 'The dashboard prototype is ready for user testing! I\'ve set up sessions for next week. Would love your input on the test scenarios before we start.', 'medium', 'task', 80, 'UI redesign'),
    msg('s3', 'Found potential memory leak in worker', 'Noticed a slow memory increase in the background worker process. It grows ~50MB per hour. Not critical yet, but we should investigate soon. I\'ve added monitoring.', 'medium', 'task', 65, 'API refactoring'),
    msg('s5', 'Competitor analysis report', 'Completed the quarterly competitor analysis. Key findings: 2 competitors launched AI features, 1 reduced pricing. Full report in the shared folder. FYI — no action needed.', 'low', 'fyi', 250),
    msg('s11', 'Office supplies order — any requests?', 'Placing the monthly office supplies order. If you need anything specific (monitors, keyboards, standing desk mats, etc.), let me know by Wednesday.', 'low', 'social', 380),
    msg('s10', 'CI/CD pipeline: 3 builds failed today', 'Three builds failed in the CI/CD pipeline today. Root cause: flaky integration tests in the auth module. Test owner has been notified. FYI.', 'low', 'fyi', 220),
    msg('s1', 'Quarterly OKR review', 'Time for our quarterly OKR review. Please update your objective progress in the tracker before our 1:1 next week. I\'d like to discuss any at-risk items.', 'medium', 'task', 130, 'sprint planning'),
    msg('s4', 'A/B test results — checkout flow', 'The checkout flow A/B test completed. Variant B shows a 12% improvement in conversion rate with statistical significance. Recommend full rollout. Need your sign-off.', 'medium', 'approval', 50, 'feature prioritization'),
    msg('s8', 'Well done on the product milestone', 'Great work on hitting the product milestone ahead of schedule. This positions us well for the investor update. Keep the momentum going!', 'low', 'fyi', 190, 'quarterly goals'),
    msg('s3', 'Lunch plans? 🍕', 'Hey, want to grab lunch today? There\'s a new place downtown. A few of us are going around 12:30.', 'low', 'social', 50),
    msg('s11', 'Updated org chart published', 'The updated organizational chart has been published on the intranet. Reflects recent team structure changes. No action needed — informational only.', 'low', 'fyi', 450),
    msg('s5', 'Webinar invitation: Future of ProductTech', 'Join our upcoming webinar on "The Future of ProductTech" featuring industry leaders. Registration link inside. Optional attendance.', 'low', 'social', 500),
];

// Extra messages for "flood inbox" simulation
export const floodMessages = [
    msg('s1', 'URGENT: Deploy rollback needed', 'The latest deployment introduced a regression. We need to rollback immediately. Users are reporting data inconsistencies in the dashboard.', 'critical', 'emergency', 1, 'sprint planning'),
    msg('s8', 'Investor meeting in 30 minutes', 'Joining the investor call soon. Need the latest revenue dashboard and user growth numbers RIGHT NOW. Critical.', 'critical', 'task', 1, 'quarterly goals'),
    msg('s4', 'Production bug: Data not syncing', 'Multiple customers reporting data sync failures. The sync service appears to be dropping events. Need immediate attention.', 'critical', 'emergency', 2, 'product roadmap'),
    msg('s3', 'Quick question about the API endpoint', 'Hey, which endpoint should I use for the batch processing feature? The docs seem outdated. Need this soon to unblock my work.', 'high', 'question', 5, 'API refactoring'),
    msg('s7', 'Escalation: SLA breach warning', 'Our monitoring shows response times approaching SLA thresholds. If not addressed within the hour, we\'ll be in breach of contract terms.', 'high', 'emergency', 3, 'contract renewal'),
    msg('s2', 'Mandatory compliance training overdue', 'Your annual compliance training is 5 days overdue. This is a priority item. Please complete the training modules by end of day today.', 'high', 'task', 10),
    msg('s9', 'Design review feedback needed', 'I\'ve incorporated the changes from last review. Can you take another look at the updated mockups? The stakeholder meeting is tomorrow.', 'medium', 'task', 15, 'UI redesign'),
    msg('s5', 'Social media trend alert', 'Heads up — our brand is trending on social media after a positive customer review went viral. No action needed, just enjoy the good vibes! 🎉', 'low', 'fyi', 20),
    msg('s10', 'Auto-scaling event triggered', 'Info: Auto-scaling triggered for production cluster. Added 3 instances to handle increased traffic. Current capacity: 85%. Monitoring.', 'low', 'fyi', 8),
    msg('s12', 'Friday Fun: Team Quiz', 'This Friday\'s team quiz theme is "Tech History". Form your teams and register by Thursday. Prizes for the top 3 teams! 🏆', 'low', 'social', 25),
];
