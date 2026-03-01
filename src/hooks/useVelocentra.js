// useVelocentra.js — Central state management hook
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { PriorityScoringEngine } from '../engine/PriorityScoringEngine';
import { DistractionFilter } from '../engine/DistractionFilter';
import { ReplyGenerator } from '../engine/ReplyGenerator';
import { LearningEngine } from '../engine/LearningEngine';
import { WorkflowOptimizer } from '../engine/WorkflowOptimizer';
import { initialMessages, floodMessages, interactionHistory, conversationContexts } from '../data/messages';

export function useVelocentra() {
    // Engine instances (stable refs)
    const scoringEngine = useRef(new PriorityScoringEngine()).current;
    const distractionFilter = useRef(new DistractionFilter()).current;
    const replyGenerator = useRef(new ReplyGenerator()).current;
    const learningEngine = useRef(new LearningEngine()).current;
    const workflowOptimizer = useRef(new WorkflowOptimizer()).current;

    // State
    const [messages, setMessages] = useState([]);
    const [rankedMessages, setRankedMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [cognitiveLoad, setCognitiveLoad] = useState('medium');
    const [zenMode, setZenMode] = useState(false);
    const [filterStats, setFilterStats] = useState({ total: 0, allowed: 0, batched: 0, delayed: 0, log: [] });
    const [replies, setReplies] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [weightHistory, setWeightHistory] = useState([]);
    const [learningData, setLearningData] = useState({});
    const [stressLevel, setStressLevel] = useState(0.3);
    const [floodCount, setFloodCount] = useState(0);
    const [filters, setFilters] = useState({ search: '', role: 'all', urgency: 'all', category: 'all' });
    const [archivedMessages, setArchivedMessages] = useState(new Set());
    const [snoozedMessages, setSnoozedMessages] = useState(new Set());
    const [readMessages, setReadMessages] = useState(new Set());

    // Initialize engines
    useEffect(() => {
        scoringEngine.updateInteractionHistory(interactionHistory);
        replyGenerator.setConversationContexts(conversationContexts);

        // Load initial messages
        const ranked = scoringEngine.rankMessages(initialMessages, cognitiveLoad);
        setMessages(initialMessages);
        setRankedMessages(ranked);

        // Initial learning data
        setWeightHistory(learningEngine.getWeightHistory());
        setLearningData({
            peakHours: learningEngine.getPeakFocusHours(),
            responseTime: learningEngine.getResponseTimeSummary(),
            ignorePatterns: learningEngine.getIgnorePatterns(),
            dailyMetrics: learningEngine.getDailyMetrics(),
            adaptedWeights: learningEngine.getAdaptedWeights(),
        });
    }, []);

    // Re-rank when cognitive load changes
    const rerank = useCallback((msgs, load, isZen) => {
        const ranked = scoringEngine.rankMessages(msgs, load);

        if (isZen) {
            // Apply distraction filter
            ranked.forEach(msg => {
                const filterResult = distractionFilter.filterMessage(msg, msg.scoring.finalScore, msg.scoring.breakdown);
                msg.filterResult = filterResult;
            });
            setFilterStats(distractionFilter.getFilterStats());
        }

        setRankedMessages(ranked);

        // Check for proactive suggestions
        const stress = load === 'high' ? 0.8 : load === 'medium' ? 0.5 : 0.2;
        setStressLevel(stress);
        const newSuggestions = workflowOptimizer.analyze(ranked, load, stress);
        setSuggestions(newSuggestions);

        return ranked;
    }, [scoringEngine, distractionFilter, workflowOptimizer]);

    // Actions
    const floodInbox = useCallback(() => {
        const flood = floodMessages.map((m, i) => ({
            ...m,
            id: `flood_${Date.now()}_${i}`,
            timestamp: new Date().toISOString(),
        }));
        const newMessages = [...messages, ...flood];
        setMessages(newMessages);
        setFloodCount(prev => prev + 1);
        const newLoad = 'high';
        setCognitiveLoad(newLoad);
        setStressLevel(0.85);
        rerank(newMessages, newLoad, zenMode);
    }, [messages, zenMode, rerank]);

    const toggleZenMode = useCallback(() => {
        const newZen = !zenMode;
        setZenMode(newZen);

        if (newZen) {
            distractionFilter.enableZenMode();
        } else {
            const result = distractionFilter.disableZenMode();
            // Released messages are now visible
            setFilterStats({ total: 0, allowed: 0, batched: 0, delayed: 0, log: [] });
        }

        rerank(messages, cognitiveLoad, newZen);
    }, [zenMode, messages, cognitiveLoad, distractionFilter, rerank]);

    const changeWorkload = useCallback((newLoad) => {
        setCognitiveLoad(newLoad);
        const stress = newLoad === 'high' ? 0.8 : newLoad === 'medium' ? 0.5 : 0.2;
        setStressLevel(stress);
        rerank(messages, newLoad, zenMode);
    }, [messages, zenMode, rerank]);

    const selectMessage = useCallback((msg) => {
        setSelectedMessage(msg);
        if (msg) {
            const generated = replyGenerator.generateReplies(msg);
            setReplies(generated);
        } else {
            setReplies(null);
        }
    }, [replyGenerator]);

    const simulateTime = useCallback(() => {
        const adaptedWeights = learningEngine.simulateTimeStep(rankedMessages, stressLevel);
        scoringEngine.updateSenderWeights(adaptedWeights);

        setWeightHistory([...learningEngine.getWeightHistory()]);
        setLearningData({
            peakHours: learningEngine.getPeakFocusHours(),
            responseTime: learningEngine.getResponseTimeSummary(),
            ignorePatterns: learningEngine.getIgnorePatterns(),
            dailyMetrics: learningEngine.getDailyMetrics(),
            adaptedWeights: learningEngine.getAdaptedWeights(),
        });

        // Re-rank with new weights
        rerank(messages, cognitiveLoad, zenMode);
    }, [rankedMessages, stressLevel, learningEngine, scoringEngine, messages, cognitiveLoad, zenMode, rerank]);

    const triggerOverload = useCallback(() => {
        setCognitiveLoad('high');
        setStressLevel(0.9);
        const overloadSuggestions = workflowOptimizer.analyze(rankedMessages, 'high', 0.9);
        setSuggestions(overloadSuggestions);
    }, [rankedMessages, workflowOptimizer]);

    const acceptSuggestion = useCallback((id) => {
        workflowOptimizer.acceptSuggestion(id);
        setSuggestions([...workflowOptimizer.getSuggestions()]);
    }, [workflowOptimizer]);

    const dismissSuggestion = useCallback((id) => {
        workflowOptimizer.dismissSuggestion(id);
        setSuggestions([...workflowOptimizer.getSuggestions()]);
    }, [workflowOptimizer]);

    const resetLearning = useCallback(() => {
        learningEngine.reset();
        setWeightHistory([]);
        setLearningData({
            peakHours: learningEngine.getPeakFocusHours(),
            responseTime: learningEngine.getResponseTimeSummary(),
            ignorePatterns: learningEngine.getIgnorePatterns(),
            dailyMetrics: learningEngine.getDailyMetrics(),
            adaptedWeights: learningEngine.getAdaptedWeights(),
        });
    }, [learningEngine]);

    // Filtered messages
    const filteredMessages = useMemo(() => {
        return rankedMessages.filter(msg => {
            if (archivedMessages.has(msg.id)) return false;
            if (snoozedMessages.has(msg.id)) return false;
            if (filters.role !== 'all' && msg.senderRole !== filters.role) return false;
            if (filters.urgency !== 'all' && msg.urgency !== filters.urgency) return false;
            if (filters.category !== 'all' && msg.category !== filters.category) return false;
            if (filters.search) {
                const q = filters.search.toLowerCase();
                if (!msg.subject.toLowerCase().includes(q) &&
                    !msg.senderName.toLowerCase().includes(q) &&
                    !msg.body.toLowerCase().includes(q)) return false;
            }
            return true;
        });
    }, [rankedMessages, filters, archivedMessages, snoozedMessages]);

    // Message stats
    const messageStats = useMemo(() => {
        return {
            total: filteredMessages.length,
            critical: filteredMessages.filter(m => m.urgency === 'critical').length,
            high: filteredMessages.filter(m => m.urgency === 'high').length,
            medium: filteredMessages.filter(m => m.urgency === 'medium').length,
            low: filteredMessages.filter(m => m.urgency === 'low').length,
        };
    }, [filteredMessages]);

    // Quick actions
    const markRead = useCallback((id) => {
        setReadMessages(prev => new Set([...prev, id]));
    }, []);

    const snoozeMessage = useCallback((id) => {
        setSnoozedMessages(prev => new Set([...prev, id]));
        // Auto-unsnooze after simulated 1hr
        setTimeout(() => {
            setSnoozedMessages(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }, 15000); // 15s in real time = simulated 1hr
    }, []);

    const archiveMessage = useCallback((id) => {
        setArchivedMessages(prev => new Set([...prev, id]));
    }, []);

    const onFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    return {
        // State
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

        // Actions
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
    };
}
