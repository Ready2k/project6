# Financial Agent Desktop Demo

A two-stage demonstration web application showcasing the evolution from static financial-services agent desktops to dynamic AI-orchestrated interfaces.

## Overview

This application demonstrates how AI can intelligently orchestrate UI components based on conversation context, moving from a cluttered, always-visible interface to a clean, context-aware workspace. It features two independent demonstrations:

- **Static View** (`/static`): Current-state agent desktop with all panels always visible
- **Dynamic View** (`/dynamic`): Future-state agent desktop with AI-driven contextual UI

Both demonstrations are driven by JSON timeline files that sequence events (transcripts, AI reasoning, UI changes) to create realistic scenarios without requiring real backend services.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Application Routes

### `/static` - Static View (Phase A)

Demonstrates the current state of agent desktops with all panels always visible:

- **Customer Profile Panel**: Displays customer information
- **Account Summary Panel**: Shows account details and balances
- **Transaction History Panel**: Lists recent transactions
- **Risk/Fraud Indicators Panel**: Displays risk alerts and fraud indicators
- **Previous Interactions Panel**: Shows interaction history
- **Telephony Controls Panel**: Non-functional UI controls for telephony
- **AI Assist Sidebar**: Real-time AI guidance with transcript, sentiment, and suggestions

The static view uses `src/data/static_timeline.json` to drive the demonstration.

### `/dynamic` - Dynamic View (Phase B)

Demonstrates the future state with AI-orchestrated contextual UI:

- **Header**: Application title and branding
- **Conversation Area**: Live transcript of customer-agent conversation
- **AI Activity Feed**: Real-time AI reasoning, actions, and status updates
- **Dynamic Tile Container**: Tiles appear/disappear based on conversation context

Supported tiles:
- **Change Address Tile**: Form for updating customer address
- **Verify Identity Tile**: Identity verification workflow
- **Update Contact Details Tile**: Update phone, email, and contact preferences
- **Dispute Transaction Tile**: Transaction dispute form

The dynamic view uses `src/data/dynamic_timeline.json` to drive the demonstration.

## Timeline Files

Timeline files are JSON arrays containing time-sequenced events that drive the demonstrations. Each event has a time offset (`t` in milliseconds) and event-specific properties.

### Timeline Event Types

#### 1. `transcript`
Displays conversation text in the transcript panel.

```json
{
  "t": 0,
  "type": "transcript",
  "speaker": "customer",
  "text": "I'd like to change my address"
}
```

#### 2. `ai_reasoning`
Shows AI reasoning in the activity feed.

```json
{
  "t": 2000,
  "type": "ai_reasoning",
  "text": "Customer has requested address change. Preparing Change Address tile."
}
```

#### 3. `ai_action_attempt`
Displays an AI action attempt.

```json
{
  "t": 3000,
  "type": "ai_action_attempt",
  "action": "show_change_address_tile"
}
```

#### 4. `ai_action_blocked`
Shows a blocked AI action with reason.

```json
{
  "t": 4000,
  "type": "ai_action_blocked",
  "action": "access_customer_ssn",
  "reason": "Insufficient permissions"
}
```

#### 5. `panel_show`
Dynamically displays a tile component.

```json
{
  "t": 5000,
  "type": "panel_show",
  "panel": "changeAddress"
}
```

Supported panel names:
- `changeAddress`
- `verifyIdentity`
- `updateContactDetails`
- `disputeTransaction`

#### 6. `panel_hide`
Removes a tile from view.

```json
{
  "t": 15000,
  "type": "panel_hide",
  "panel": "changeAddress"
}
```

#### 7. `auto_populate`
Pre-fills form fields with AI-suggested values.

```json
{
  "t": 6000,
  "type": "auto_populate",
  "panel": "changeAddress",
  "data": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102"
  }
}
```

### Modifying Timeline Files

Timeline files are located in `src/data/`:
- `static_timeline.json` - Events for static view
- `dynamic_timeline.json` - Events for dynamic view

To modify a timeline:

1. Open the appropriate JSON file
2. Add, remove, or modify events in the array
3. Ensure each event has a `t` (time offset in milliseconds) property
4. Events will be processed in order of their time offset, regardless of array order
5. Save the file - changes will be reflected on page reload

**Example: Adding a new event**

```json
{
  "t": 8000,
  "type": "transcript",
  "speaker": "agent",
  "text": "I can help you with that. Let me pull up the form."
}
```

**Tips:**
- Start with `t: 0` for the first event
- Space events 2-5 seconds apart for readability
- Use realistic conversation flow
- Test your timeline by running the application

## Adding New Tiles

To add a new tile component:

### 1. Create the Tile Component

Create a new file in `src/components/tiles/`:

```tsx
// src/components/tiles/NewTile.tsx
import { useState } from 'react';
import { TileProps } from '../../types/components';

export default function NewTile({ data, onSubmit, status = 'idle' }: TileProps) {
  const [formData, setFormData] = useState({
    field1: data?.field1 || '',
    field2: data?.field2 || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">New Tile Title</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Field 1</label>
          <input
            type="text"
            value={formData.field1}
            onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
            className={`w-full px-3 py-2 border rounded ${
              data?.field1 ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
            }`}
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'submitting' || status === 'completed'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {status === 'completed' ? 'Completed ✓' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
```

### 2. Register the Tile

Add the tile to `src/components/dynamic/DynamicTileContainer.tsx`:

```tsx
import NewTile from '../tiles/NewTile';

// In the tileComponents object:
const tileComponents: Record<string, React.ComponentType<TileProps>> = {
  changeAddress: ChangeAddressTile,
  verifyIdentity: VerifyIdentityTile,
  updateContactDetails: UpdateContactDetailsTile,
  disputeTransaction: DisputeTransactionTile,
  newTile: NewTile, // Add your new tile here
};
```

### 3. Update Timeline

Add events to your timeline file to show and interact with the new tile:

```json
[
  {
    "t": 5000,
    "type": "panel_show",
    "panel": "newTile"
  },
  {
    "t": 6000,
    "type": "auto_populate",
    "panel": "newTile",
    "data": {
      "field1": "Pre-filled value",
      "field2": "Another value"
    }
  }
]
```

### 4. Update Types (Optional)

If your tile has specific data requirements, update `src/types/components.ts`:

```tsx
export interface NewTileData {
  field1?: string;
  field2?: string;
}
```

## Project Structure

```
financial-agent-desktop-demo/
├── src/
│   ├── components/
│   │   ├── static/              # Static view components (Phase A)
│   │   │   ├── StaticView.tsx
│   │   │   ├── CustomerProfilePanel.tsx
│   │   │   ├── AccountSummaryPanel.tsx
│   │   │   ├── TransactionHistoryPanel.tsx
│   │   │   ├── RiskFraudPanel.tsx
│   │   │   ├── PreviousInteractionsPanel.tsx
│   │   │   ├── TelephonyControlsPanel.tsx
│   │   │   └── AiAssistSidebar.tsx
│   │   ├── dynamic/             # Dynamic view components (Phase B)
│   │   │   ├── DynamicView.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ConversationArea.tsx
│   │   │   ├── AiActivityFeed.tsx
│   │   │   └── DynamicTileContainer.tsx
│   │   ├── shared/              # Shared components
│   │   │   └── TranscriptPanel.tsx
│   │   └── tiles/               # Tile components
│   │       ├── ChangeAddressTile.tsx
│   │       ├── VerifyIdentityTile.tsx
│   │       ├── UpdateContactDetailsTile.tsx
│   │       └── DisputeTransactionTile.tsx
│   ├── hooks/                   # Custom React hooks
│   │   └── useTimeline.ts       # Timeline engine hook
│   ├── types/                   # TypeScript type definitions
│   │   ├── timeline.ts          # Timeline event types
│   │   ├── models.ts            # Mock data models
│   │   ├── components.ts        # Component prop types
│   │   └── index.ts             # Type exports
│   ├── data/                    # Timeline JSON files and mock data
│   │   ├── static_timeline.json
│   │   ├── dynamic_timeline.json
│   │   └── mock_data.ts
│   ├── test/                    # Test setup
│   │   └── setup.ts
│   ├── App.tsx                  # Main app component with routing
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── tests/
│   ├── unit/                    # Unit tests
│   │   ├── App.test.tsx
│   │   ├── DynamicView.test.tsx
│   │   ├── StaticView.test.tsx
│   │   ├── error-handling.test.tsx
│   │   ├── setup.test.ts
│   │   └── useTimeline.test.ts
│   └── property/                # Property-based tests
│       ├── auto-populate-fills-fields.test.tsx
│       ├── auto-populate-visual-indicators.test.tsx
│       ├── dynamic-panel-show-hide.test.tsx
│       ├── event-to-ui-rendering.test.ts
│       ├── static-view-panel-persistence.test.tsx
│       ├── tile-submission-status.test.tsx
│       ├── timeline-continuation.test.ts
│       ├── timeline-event-types.test.ts
│       └── timeline-ordering.test.ts
├── index.html
├── package.json
├── vite.config.ts               # Vite and Vitest configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md
```

## Technology Stack

- **React** 19.2.0 with TypeScript
- **Vite** 7.2.5 - Build tool and dev server
- **React Router** 7.9.6 - Client-side routing
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **Vitest** 4.0.13 - Unit testing framework
- **fast-check** 4.3.0 - Property-based testing library

## Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The project includes:
- **Unit tests**: Component rendering, timeline logic, error handling
- **Property-based tests**: Correctness properties verified across random inputs

## Key Features

### Timeline Engine

The `useTimeline` hook processes timeline events sequentially with time-based delays:

```tsx
const { state, controls } = useTimeline(timelineData);
```

Returns:
- `state.transcripts`: Array of conversation lines
- `state.aiActivities`: Array of AI reasoning/actions
- `state.visiblePanels`: Set of currently visible panel names
- `state.tileData`: Auto-populated data for tiles
- `controls.play()`, `controls.pause()`, `controls.reset()`: Playback controls

### Auto-Populate

Form fields populated via `auto_populate` events receive visual indicators (blue background and border) to distinguish them from manually-entered values.

### Mock Data

All customer data, transactions, and risk indicators are mock data defined in `src/data/mock_data.ts`. No external APIs or databases are required.

## Development

### Code Quality

Run ESLint:

```bash
npm run lint
```

### Hot Module Replacement

The development server supports HMR - changes to components will be reflected immediately without full page reload.

## License

See LICENSE file for details.
