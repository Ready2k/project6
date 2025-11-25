// Component Prop Interfaces

export interface TileProps {
  data?: Record<string, any>;
  onSubmit: (formData: any) => void;
  status?: 'idle' | 'submitting' | 'completed';
}

export interface TranscriptPanelProps {
  transcripts: Array<{
    speaker: 'customer' | 'agent';
    text: string;
    timestamp: number;
  }>;
}

export interface AiActivityFeedProps {
  activities: Array<{
    type: 'reasoning' | 'action_attempt' | 'action_blocked';
    text: string;
    action?: string;
    reason?: string;
    timestamp: number;
  }>;
}

export interface DynamicTileContainerProps {
  visiblePanels: Set<string>;
  tileData: Record<string, any>;
  onTileSubmit: (panelName: string, formData: any) => void;
}
