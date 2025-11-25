// Timeline Event Type Definitions
// Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7

export type TranscriptEvent = {
  t: number;
  event: 'transcript';
  speaker: 'customer' | 'agent';
  text: string;
};

export type AiReasoningEvent = {
  t: number;
  event: 'ai_reasoning';
  text: string;
};

export type AiActionAttemptEvent = {
  t: number;
  event: 'ai_action_attempt';
  action: string;
};

export type AiActionBlockedEvent = {
  t: number;
  event: 'ai_action_blocked';
  action: string;
  reason: string;
};

export type PanelShowEvent = {
  t: number;
  event: 'panel_show';
  panel: string;
};

export type PanelHideEvent = {
  t: number;
  event: 'panel_hide';
  panel: string;
};

export type AutoPopulateEvent = {
  t: number;
  event: 'auto_populate';
  panel: string;
  data: Record<string, any>;
};

export type MouseMoveEvent = {
  t: number;
  event: 'mouse_move';
  target: string; // CSS selector
};

export type MouseClickEvent = {
  t: number;
  event: 'mouse_click';
  target: string; // CSS selector
};

export type TabSwitchEvent = {
  t: number;
  event: 'tab_switch';
  tab: string;
};

export type TabLoadingEvent = {
  t: number;
  event: 'tab_loading';
  tab: string;
};

export type TabLoadedEvent = {
  t: number;
  event: 'tab_loaded';
  tab: string;
};

export type FormTypingEvent = {
  t: number;
  event: 'form_typing';
  field: string; // CSS selector or field name
  value: string;
};

export type NarrationEvent = {
  t: number;
  event: 'narration';
  text: string;
};

export type SentimentEvent = {
  t: number;
  event: 'sentiment';
  value: number; // 0-100
  label: 'Negative' | 'Neutral' | 'Positive';
};

export type TimelineEvent =
  | TranscriptEvent
  | AiReasoningEvent
  | AiActionAttemptEvent
  | AiActionBlockedEvent
  | PanelShowEvent
  | PanelHideEvent
  | AutoPopulateEvent
  | MouseMoveEvent
  | MouseClickEvent
  | TabSwitchEvent
  | TabLoadingEvent
  | TabLoadedEvent
  | FormTypingEvent
  | NarrationEvent
  | SentimentEvent;

export interface TranscriptLine {
  speaker: 'customer' | 'agent';
  text: string;
  timestamp: number;
}

export interface AiActivity {
  type: 'reasoning' | 'action_attempt' | 'action_blocked';
  text: string;
  action?: string;
  reason?: string;
  timestamp: number;
}

export interface TimelineState {
  transcripts: TranscriptLine[];
  aiActivities: AiActivity[];
  visiblePanels: Set<string>;
  tileData: Record<string, any>;
  tileStatuses: Record<string, 'idle' | 'submitting' | 'completed'>;
  isPlaying: boolean;
  currentTime: number;
}
