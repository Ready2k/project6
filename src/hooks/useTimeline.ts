// Timeline Engine Hook
// Requirements: 4.5, 7.8
// Manages event sequencing, timing, and state for timeline-driven demonstrations

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  TimelineEvent,
  TimelineState,
  TranscriptLine,
  AiActivity,
  TranscriptEvent,
  AiReasoningEvent,
  AiActionAttemptEvent,
  AiActionBlockedEvent,
  PanelShowEvent,
  PanelHideEvent,
  AutoPopulateEvent,
  MouseMoveEvent,
  MouseClickEvent,
  TabSwitchEvent,
  TabLoadingEvent,
  TabLoadedEvent,
} from '../types/timeline';

interface UseTimelineReturn extends TimelineState {
  play: () => void;
  pause: () => void;
  reset: () => void;
  handleTileSubmit: (panelName: string, formData: any) => void;
  tileStatuses: Record<string, 'idle' | 'submitting' | 'completed'>;
  mouseTarget: string | null;
  mouseAction: 'move' | 'click' | null;
  mouseVisible: boolean;
  activeTab: string | null;
  tabLoading: boolean;
}

export function useTimeline(timelineData: TimelineEvent[]): UseTimelineReturn {
  // Sort events by time offset (Requirement 7.8)
  const sortedEvents = useRef<TimelineEvent[]>([]);
  
  useEffect(() => {
    try {
      // Validate timeline data structure
      if (!Array.isArray(timelineData)) {
        console.error('Timeline data must be an array');
        sortedEvents.current = [];
        return;
      }
      
      // Filter out invalid events and sort valid ones
      const validEvents = timelineData.filter(event => {
        if (!event || typeof event !== 'object') {
          console.warn('Invalid event: not an object', event);
          return false;
        }
        if (typeof event.t !== 'number') {
          console.warn('Invalid event: missing or invalid time offset (t)', event);
          return false;
        }
        if (!event.event || typeof event.event !== 'string') {
          console.warn('Invalid event: missing or invalid event type', event);
          return false;
        }
        return true;
      });
      
      sortedEvents.current = validEvents.sort((a, b) => a.t - b.t);
    } catch (error) {
      console.error('Error processing timeline data:', error);
      sortedEvents.current = [];
    }
  }, [timelineData]);

  // Timeline state
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  const [aiActivities, setAiActivities] = useState<AiActivity[]>([]);
  const [visiblePanels, setVisiblePanels] = useState<Set<string>>(new Set());
  const [tileData, setTileData] = useState<Record<string, any>>({});
  const [tileStatuses, setTileStatuses] = useState<Record<string, 'idle' | 'submitting' | 'completed'>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mouseTarget, setMouseTarget] = useState<string | null>(null);
  const [mouseAction, setMouseAction] = useState<'move' | 'click' | null>(null);
  const [mouseVisible, setMouseVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [tabLoading, setTabLoading] = useState(false);

  // Refs for managing timeline playback
  const currentEventIndex = useRef(0);
  const timeoutId = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const pausedAt = useRef<number>(0);

  // Process a single event
  const processEvent = useCallback((event: TimelineEvent) => {
    try {
      switch (event.event) {
        case 'transcript': {
          const transcriptEvent = event as TranscriptEvent;
          // Validate required properties
          if (typeof transcriptEvent.text !== 'string') {
            console.warn('Invalid transcript event: missing or invalid text property', event);
            break;
          }
          if (!transcriptEvent.speaker) {
            console.warn('Invalid transcript event: missing speaker property', event);
            break;
          }
          setTranscripts(prev => [
            ...prev,
            {
              speaker: transcriptEvent.speaker,
              text: transcriptEvent.text,
              timestamp: transcriptEvent.t,
            },
          ]);
          break;
        }

        case 'ai_reasoning': {
          const reasoningEvent = event as AiReasoningEvent;
          // Validate required properties
          if (typeof reasoningEvent.text !== 'string') {
            console.warn('Invalid ai_reasoning event: missing or invalid text property', event);
            break;
          }
          setAiActivities(prev => [
            ...prev,
            {
              type: 'reasoning',
              text: reasoningEvent.text,
              timestamp: reasoningEvent.t,
            },
          ]);
          break;
        }

        case 'ai_action_attempt': {
          const attemptEvent = event as AiActionAttemptEvent;
          // Validate required properties
          if (typeof attemptEvent.action !== 'string') {
            console.warn('Invalid ai_action_attempt event: missing or invalid action property', event);
            break;
          }
          setAiActivities(prev => [
            ...prev,
            {
              type: 'action_attempt',
              text: `Attempting: ${attemptEvent.action}`,
              action: attemptEvent.action,
              timestamp: attemptEvent.t,
            },
          ]);
          break;
        }

        case 'ai_action_blocked': {
          const blockedEvent = event as AiActionBlockedEvent;
          // Validate required properties
          if (typeof blockedEvent.action !== 'string') {
            console.warn('Invalid ai_action_blocked event: missing or invalid action property', event);
            break;
          }
          if (typeof blockedEvent.reason !== 'string') {
            console.warn('Invalid ai_action_blocked event: missing or invalid reason property', event);
            break;
          }
          setAiActivities(prev => [
            ...prev,
            {
              type: 'action_blocked',
              text: `Blocked: ${blockedEvent.action}`,
              action: blockedEvent.action,
              reason: blockedEvent.reason,
              timestamp: blockedEvent.t,
            },
          ]);
          break;
        }

        case 'panel_show': {
          const showEvent = event as PanelShowEvent;
          // Validate required properties
          if (typeof showEvent.panel !== 'string') {
            console.warn('Invalid panel_show event: missing or invalid panel property', event);
            break;
          }
          setVisiblePanels(prev => new Set(prev).add(showEvent.panel));
          break;
        }

        case 'panel_hide': {
          const hideEvent = event as PanelHideEvent;
          // Validate required properties
          if (typeof hideEvent.panel !== 'string') {
            console.warn('Invalid panel_hide event: missing or invalid panel property', event);
            break;
          }
          setVisiblePanels(prev => {
            const newSet = new Set(prev);
            newSet.delete(hideEvent.panel);
            return newSet;
          });
          break;
        }

        case 'auto_populate': {
          const populateEvent = event as AutoPopulateEvent;
          // Validate required properties
          if (typeof populateEvent.panel !== 'string') {
            console.warn('Invalid auto_populate event: missing or invalid panel property', event);
            break;
          }
          if (!populateEvent.data || typeof populateEvent.data !== 'object') {
            console.warn('Invalid auto_populate event: missing or invalid data property', event);
            break;
          }
          setTileData(prev => ({
            ...prev,
            [populateEvent.panel]: populateEvent.data,
          }));
          break;
        }

        case 'mouse_move': {
          const moveEvent = event as MouseMoveEvent;
          if (typeof moveEvent.target !== 'string') {
            console.warn('Invalid mouse_move event: missing or invalid target property', event);
            break;
          }
          setMouseTarget(moveEvent.target);
          setMouseAction('move');
          setMouseVisible(true);
          // Hide cursor after 2 seconds
          setTimeout(() => setMouseVisible(false), 2000);
          break;
        }

        case 'mouse_click': {
          const clickEvent = event as MouseClickEvent;
          if (typeof clickEvent.target !== 'string') {
            console.warn('Invalid mouse_click event: missing or invalid target property', event);
            break;
          }
          setMouseTarget(clickEvent.target);
          setMouseAction('click');
          setMouseVisible(true);
          // Hide cursor after click animation
          setTimeout(() => setMouseVisible(false), 1500);
          break;
        }

        case 'tab_switch': {
          const tabEvent = event as TabSwitchEvent;
          if (typeof tabEvent.tab !== 'string') {
            console.warn('Invalid tab_switch event: missing or invalid tab property', event);
            break;
          }
          setActiveTab(tabEvent.tab);
          setTabLoading(false);
          break;
        }

        case 'tab_loading': {
          const loadingEvent = event as TabLoadingEvent;
          if (typeof loadingEvent.tab !== 'string') {
            console.warn('Invalid tab_loading event: missing or invalid tab property', event);
            break;
          }
          setTabLoading(true);
          break;
        }

        case 'tab_loaded': {
          const loadedEvent = event as TabLoadedEvent;
          if (typeof loadedEvent.tab !== 'string') {
            console.warn('Invalid tab_loaded event: missing or invalid tab property', event);
            break;
          }
          setTabLoading(false);
          break;
        }

        default:
          console.warn('Unrecognized event type:', (event as any).event);
      }
    } catch (error) {
      console.error('Error processing event:', event, error);
    }
  }, []);

  // Schedule next event
  const scheduleNextEvent = useCallback(() => {
    if (currentEventIndex.current >= sortedEvents.current.length) {
      setIsPlaying(false);
      return;
    }

    const event = sortedEvents.current[currentEventIndex.current];
    const previousEventTime = currentEventIndex.current > 0 
      ? sortedEvents.current[currentEventIndex.current - 1].t 
      : 0;
    
    const delay = event.t - previousEventTime;

    timeoutId.current = window.setTimeout(() => {
      processEvent(event);
      setCurrentTime(event.t);
      currentEventIndex.current++;
      scheduleNextEvent();
    }, delay);
  }, [processEvent]);

  // Play control
  const hasStartedRef = useRef(false);
  const play = useCallback(() => {
    if (isPlaying) return;
    
    hasStartedRef.current = true;
    setIsPlaying(true);
    
    if (currentEventIndex.current === 0) {
      startTime.current = Date.now();
    } else {
      // Resume from paused position
      startTime.current = Date.now() - pausedAt.current;
    }
    
    scheduleNextEvent();
  }, [isPlaying, scheduleNextEvent]);

  // Pause control
  const pause = useCallback(() => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    pausedAt.current = Date.now() - startTime.current;
    
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, [isPlaying]);

  // Reset control
  const reset = useCallback(() => {
    setIsPlaying(false);
    setTranscripts([]);
    setAiActivities([]);
    setVisiblePanels(new Set());
    setTileData({});
    setTileStatuses({});
    setCurrentTime(0);
    setMouseTarget(null);
    setMouseAction(null);
    setMouseVisible(false);
    setActiveTab(null);
    setTabLoading(false);
    currentEventIndex.current = 0;
    pausedAt.current = 0;
    
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  // Handle tile submission (Requirement 5.5 - timeline continues after submission)
  const handleTileSubmit = useCallback((panelName: string, formData: any) => {
    try {
      console.log(`Tile ${panelName} submitted with data:`, formData);
      
      // Set status to submitting
      setTileStatuses(prev => ({ ...prev, [panelName]: 'submitting' }));
      
      // Simulate async submission and then mark as completed
      setTimeout(() => {
        setTileStatuses(prev => ({ ...prev, [panelName]: 'completed' }));
      }, 500);
      
      // Timeline continues automatically - no need to pause or block
    } catch (error) {
      console.error('Error submitting tile:', panelName, error);
      // Set status to idle on error so user can retry
      setTileStatuses(prev => ({ ...prev, [panelName]: 'idle' }));
    }
  }, []);

  // Auto-start timeline on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sortedEvents.current.length > 0 && !isPlaying && currentEventIndex.current === 0 && !hasStartedRef.current) {
        hasStartedRef.current = true;
        play();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return {
    transcripts,
    aiActivities,
    visiblePanels,
    tileData,
    tileStatuses,
    isPlaying,
    currentTime,
    play,
    pause,
    reset,
    handleTileSubmit,
    mouseTarget,
    mouseAction,
    mouseVisible,
    activeTab,
    tabLoading,
  };
}
