# Design Document

## Overview

The Financial Services Dynamic Agent Desktop Demo is a React-based web application that demonstrates the evolution from static, cluttered agent interfaces to dynamic, AI-orchestrated workspaces. The application consists of two independent demonstrations accessible via separate routes:

- **/static**: Demonstrates current-state agent desktop with all panels always visible
- **/dynamic**: Demonstrates future-state agent desktop with AI-driven contextual UI

Both demonstrations are driven by JSON timeline files that sequence events (transcripts, AI actions, UI changes) to create realistic scenarios without requiring real backend services.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Application                    │
│                                                          │
│  ┌────────────┐              ┌────────────────────────┐ │
│  │   Router   │              │   Timeline Engine      │ │
│  │            │              │   - Event dispatcher   │ │
│  │ /static    │──────────────│   - Time sequencing    │ │
│  │ /dynamic   │              │   - State management   │ │
│  └────────────┘              └────────────────────────┘ │
│                                                          │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │   Static View        │    │   Dynamic View       │  │
│  │   - Fixed panels     │    │   - Minimal start    │  │
│  │   - AI sidebar       │    │   - Dynamic tiles    │  │
│  │   - Mock data        │    │   - AI activity feed │  │
│  └──────────────────────┘    └──────────────────────┘  │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │              Shared Components                       ││
│  │  - TranscriptPanel                                   ││
│  │  - Tiles (ChangeAddress, VerifyIdentity, etc.)      ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   JSON Timeline Files │
              │   - static_timeline   │
              │   - dynamic_timeline  │
              └───────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React hooks (useState, useReducer, useContext)
- **Styling**: CSS Modules or Tailwind CSS (for rapid prototyping)
- **No Backend**: Static JSON files served via Vite's dev server

## Components and Interfaces

### Core Components

#### 1. App Component
- Root component managing routing
- Provides routes for /static and /dynamic views

#### 2. TimelineEngine (Hook)
- Custom React hook: `useTimeline(timelineData)`
- Manages event sequencing and timing
- Returns current state and event dispatcher
- Interface:
```typescript
interface TimelineEvent {
  t: number; // milliseconds offset
  event: 'transcript' | 'ai_reasoning' | 'ai_action_attempt' | 
         'ai_action_blocked' | 'panel_show' | 'panel_hide' | 'auto_populate';
  [key: string]: any; // event-specific properties
}

interface TimelineState {
  transcripts: TranscriptLine[];
  aiActivities: AiActivity[];
  visiblePanels: Set<string>;
  tileData: Record<string, any>;
  isPlaying: boolean;
  currentTime: number;
}
```

#### 3. StaticView Component
- Container for Phase A demonstration
- Renders all fixed panels
- Includes AI Assist Sidebar
- Sub-components:
  - CustomerProfilePanel
  - AccountSummaryPanel
  - TransactionHistoryPanel
  - RiskFraudPanel
  - PreviousInteractionsPanel
  - TelephonyControlsPanel
  - AiAssistSidebar

#### 4. DynamicView Component
- Container for Phase B demonstration
- Minimal initial layout
- Dynamically mounts/unmounts tiles
- Sub-components:
  - Header
  - ConversationArea
  - AiActivityFeed
  - DynamicTileContainer

#### 5. Tile Components
Each tile is a self-contained component with:
- Form fields (mock inputs)
- Submit button
- Status indicator
- Auto-populate capability

Tiles:
- ChangeAddressTile
- VerifyIdentityTile
- UpdateContactDetailsTile
- DisputeTransactionTile

Interface:
```typescript
interface TileProps {
  data?: Record<string, any>; // auto-populated data
  onSubmit: (formData: any) => void;
  status?: 'idle' | 'submitting' | 'completed';
}
```

#### 6. TranscriptPanel Component
- Displays conversation lines
- Shows speaker (Customer/Agent)
- Progressive rendering with delays
- Shared between static and dynamic views

#### 7. AiActivityFeed Component
- Displays AI reasoning and actions
- Shows timestamps
- Color-coded by event type (reasoning, attempt, blocked)
- Auto-scrolls to latest activity

### Data Models

#### Timeline Event Types

```typescript
type TranscriptEvent = {
  t: number;
  event: 'transcript';
  speaker: 'customer' | 'agent';
  text: string;
};

type AiReasoningEvent = {
  t: number;
  event: 'ai_reasoning';
  text: string;
};

type AiActionAttemptEvent = {
  t: number;
  event: 'ai_action_attempt';
  action: string;
};

type AiActionBlockedEvent = {
  t: number;
  event: 'ai_action_blocked';
  action: string;
  reason: string;
};

type PanelShowEvent = {
  t: number;
  event: 'panel_show';
  panel: string; // tile component name
};

type PanelHideEvent = {
  t: number;
  event: 'panel_hide';
  panel: string;
};

type AutoPopulateEvent = {
  t: number;
  event: 'auto_populate';
  panel: string;
  data: Record<string, any>;
};
```

#### Mock Data Models

```typescript
interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  phone: string;
  email: string;
  address: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

interface RiskIndicator {
  type: string;
  level: 'low' | 'medium' | 'high';
  description: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Static view panel persistence
*For any* point in time during static demo execution, the set of visible panels should remain constant and equal to the initial set of panels (Customer Profile, Account Summary, Transaction History, Risk/Fraud Indicators, Previous Interactions, Telephony/Chat Controls, AI Assist Sidebar).
**Validates: Requirements 1.8**

### Property 2: Event-to-UI rendering consistency
*For any* timeline event of type transcript, ai_reasoning, ai_action_attempt, or ai_action_blocked, after the event is processed, the corresponding text or message should appear in the appropriate UI component (transcript panel, AI activity feed, or AI assist sidebar).
**Validates: Requirements 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4**

### Property 3: Dynamic panel show/hide
*For any* panel_show event followed by a panel_hide event for the same panel, the panel should be visible after the show event and not visible after the hide event.
**Validates: Requirements 3.2, 3.3**

### Property 4: Auto-populate fills form fields
*For any* auto_populate event with panel name and data object, after the event is processed, the specified tile's form fields should contain the values from the data object.
**Validates: Requirements 5.1**

### Property 5: Auto-populated fields have visual indicators
*For any* form field that receives data via auto_populate event, the field should have a visual indicator (CSS class, attribute, or styling) distinguishing it from manually-entered fields.
**Validates: Requirements 5.2**

### Property 6: Tile submission updates status
*For any* tile with a submit button, when the submit button is clicked and submission completes, the tile status should transition from 'idle' to 'completed'.
**Validates: Requirements 5.3, 5.4**

### Property 7: Timeline continues after tile submission
*For any* timeline with events after a tile submission, the subsequent events should still be processed and rendered after the submission completes.
**Validates: Requirements 5.5**

### Property 8: Timeline event ordering
*For any* timeline with multiple events, the events should be processed in ascending order of their time offset (t property), regardless of their order in the JSON array.
**Validates: Requirements 4.5, 7.8**

### Property 9: Timeline engine handles all event types
*For any* valid timeline event (transcript, ai_reasoning, ai_action_attempt, ai_action_blocked, panel_show, panel_hide, auto_populate), the timeline engine should process it without errors and update application state appropriately.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7**

## Error Handling

### Timeline Loading Errors
- If JSON timeline file is malformed, display error message to user
- If timeline file is missing, use empty timeline and log warning
- Validate timeline structure on load (array of events with required properties)

### Event Processing Errors
- If event type is unrecognized, log warning and skip event
- If event is missing required properties, log error and skip event
- If panel name in panel_show/panel_hide doesn't match known tile, log warning

### Tile Interaction Errors
- If auto_populate references non-existent form field, log warning and populate available fields
- If tile submission fails (mock), display error state in tile
- Prevent multiple simultaneous submissions on same tile

### Graceful Degradation
- If timeline engine fails, application should remain functional with manual controls
- Missing mock data should not crash application, use fallback empty states
- CSS/styling failures should not prevent functional operation

## Testing Strategy

### Unit Testing

We will use **Vitest** as the testing framework for unit tests, leveraging its fast execution and excellent React Testing Library integration.

Unit tests will cover:

1. **Component Rendering**
   - Static view renders all required panels
   - Dynamic view renders minimal initial interface
   - Individual tiles render with correct form fields
   - Example: Test that StaticView contains CustomerProfilePanel, AccountSummaryPanel, etc.

2. **Timeline Engine Core Logic**
   - Event parsing from JSON
   - Event sorting by time offset
   - State updates for each event type
   - Example: Test that timeline with events [t:100, t:0, t:50] processes in order [0, 50, 100]

3. **Tile Interactions**
   - Submit button triggers onSubmit callback
   - Status updates after submission
   - Form field updates when data prop changes
   - Example: Test that clicking submit on ChangeAddressTile calls onSubmit with form data

4. **Edge Cases**
   - Empty timeline
   - Timeline with single event
   - Auto-populate with missing fields
   - Panel show/hide for non-existent panel

### Property-Based Testing

We will use **fast-check** as the property-based testing library for JavaScript/TypeScript.

Property-based tests will:
- Run a minimum of 100 iterations per property
- Use custom generators for timeline events, mock data, and UI states
- Each test will be tagged with a comment referencing the design document property

Property tests will cover:

1. **Property 1: Static view panel persistence**
   - Generator: Random timeline events for static view
   - Test: Panel set remains constant throughout execution
   - Tag: `// Feature: financial-agent-desktop-demo, Property 1: Static view panel persistence`

2. **Property 2: Event-to-UI rendering consistency**
   - Generator: Random transcript, ai_reasoning, ai_action_attempt, ai_action_blocked events
   - Test: Each event's content appears in correct UI component
   - Tag: `// Feature: financial-agent-desktop-demo, Property 2: Event-to-UI rendering consistency`

3. **Property 3: Dynamic panel show/hide**
   - Generator: Random sequences of panel_show and panel_hide events
   - Test: Panel visibility matches expected state after each event
   - Tag: `// Feature: financial-agent-desktop-demo, Property 3: Dynamic panel show/hide`

4. **Property 4: Auto-populate fills form fields**
   - Generator: Random auto_populate events with various data shapes
   - Test: Form fields contain values from event data
   - Tag: `// Feature: financial-agent-desktop-demo, Property 4: Auto-populate fills form fields`

5. **Property 5: Auto-populated fields have visual indicators**
   - Generator: Random auto_populate events
   - Test: Auto-populated fields have distinguishing attributes/classes
   - Tag: `// Feature: financial-agent-desktop-demo, Property 5: Auto-populated fields have visual indicators`

6. **Property 6: Tile submission updates status**
   - Generator: Random tile types and form data
   - Test: Status transitions from idle to completed after submit
   - Tag: `// Feature: financial-agent-desktop-demo, Property 6: Tile submission updates status`

7. **Property 7: Timeline continues after tile submission**
   - Generator: Random timelines with events after submission points
   - Test: All events process even after tile submissions
   - Tag: `// Feature: financial-agent-desktop-demo, Property 7: Timeline continues after tile submission`

8. **Property 8: Timeline event ordering**
   - Generator: Random timelines with shuffled event orders
   - Test: Events process in ascending time offset order
   - Tag: `// Feature: financial-agent-desktop-demo, Property 8: Timeline event ordering`

9. **Property 9: Timeline engine handles all event types**
   - Generator: Random mix of all valid event types
   - Test: No errors thrown, state updates correctly for each type
   - Tag: `// Feature: financial-agent-desktop-demo, Property 9: Timeline engine handles all event types`

### Integration Testing

Integration tests will verify:
- Route navigation between /static and /dynamic
- Complete timeline playback from start to finish
- Interaction between timeline engine and UI components
- Full user flow: view transcript → see AI reasoning → tile appears → auto-populate → submit

### Test Data Generators

Custom generators for property-based testing:

```typescript
// Generate random timeline events
const timelineEventGenerator = fc.oneof(
  transcriptEventGen(),
  aiReasoningEventGen(),
  panelShowEventGen(),
  autoPopulateEventGen()
  // ... etc
);

// Generate random mock customer data
const customerDataGenerator = fc.record({
  id: fc.uuid(),
  name: fc.fullName(),
  accountNumber: fc.accountNumber(),
  // ... etc
});
```

### Testing Approach

1. **Implementation-first development**: Implement features before writing corresponding tests
2. **Test core logic thoroughly**: Focus on timeline engine and state management
3. **UI tests focus on behavior**: Test that UI responds correctly to state changes, not implementation details
4. **Property tests catch edge cases**: Use property-based testing to discover unexpected input combinations
5. **Keep tests fast**: Mock time delays in tests, use fake timers
6. **Maintain test independence**: Each test should be runnable in isolation

## Implementation Notes

### Timeline Engine Implementation

The timeline engine will be implemented as a custom React hook that:
1. Accepts timeline JSON data as input
2. Maintains internal state for current time and processed events
3. Uses `setTimeout` or `requestAnimationFrame` for time-based event triggering
4. Provides controls for play/pause/reset (optional for demo)
5. Returns current state (transcripts, activities, visible panels, tile data)

### State Management Strategy

Use React Context for global state:
- TimelineContext: Current timeline state and dispatcher
- ViewContext: Current view mode (static/dynamic)

Use local component state for:
- Tile form inputs
- Tile submission status
- UI-only state (hover, focus, etc.)

### Styling Approach

For rapid prototyping, use **Tailwind CSS** with custom components:
- Consistent spacing and colors
- Responsive layout (though demo is desktop-focused)
- Smooth transitions for dynamic tile appearance
- Visual distinction between static (busy) and dynamic (clean) views

### Performance Considerations

- Virtualize transaction history if list is long (react-window)
- Memoize tile components to prevent unnecessary re-renders
- Debounce form input changes if needed
- Keep timeline events under 100 for smooth playback

### Accessibility

While this is a demo, maintain basic accessibility:
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation for tiles and forms
- Sufficient color contrast

### File Structure

```
financial-agent-desktop-demo/
├── src/
│   ├── components/
│   │   ├── static/
│   │   │   ├── StaticView.tsx
│   │   │   ├── CustomerProfilePanel.tsx
│   │   │   ├── AccountSummaryPanel.tsx
│   │   │   ├── TransactionHistoryPanel.tsx
│   │   │   ├── RiskFraudPanel.tsx
│   │   │   ├── PreviousInteractionsPanel.tsx
│   │   │   ├── TelephonyControlsPanel.tsx
│   │   │   └── AiAssistSidebar.tsx
│   │   ├── dynamic/
│   │   │   ├── DynamicView.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ConversationArea.tsx
│   │   │   ├── AiActivityFeed.tsx
│   │   │   └── DynamicTileContainer.tsx
│   │   ├── shared/
│   │   │   └── TranscriptPanel.tsx
│   │   └── tiles/
│   │       ├── ChangeAddressTile.tsx
│   │       ├── VerifyIdentityTile.tsx
│   │       ├── UpdateContactDetailsTile.tsx
│   │       └── DisputeTransactionTile.tsx
│   ├── hooks/
│   │   └── useTimeline.ts
│   ├── types/
│   │   ├── timeline.ts
│   │   └── models.ts
│   ├── data/
│   │   ├── static_timeline.json
│   │   ├── dynamic_timeline.json
│   │   └── mock_data.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   ├── unit/
│   │   ├── timeline.test.ts
│   │   ├── tiles.test.tsx
│   │   └── components.test.tsx
│   └── property/
│       ├── timeline-properties.test.ts
│       └── ui-properties.test.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```
