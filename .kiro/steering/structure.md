# Project Structure

## Directory Organization

```
src/
├── components/
│   ├── static/          # Static view components (Phase A)
│   ├── dynamic/         # Dynamic view components (Phase B)
│   ├── shared/          # Shared components (e.g., TranscriptPanel)
│   └── tiles/           # Tile components (ChangeAddress, VerifyIdentity, etc.)
├── hooks/               # Custom React hooks (e.g., useTimeline)
├── types/               # TypeScript type definitions and interfaces
├── data/                # Timeline JSON files and mock data
└── test/                # Test setup and utilities

tests/
├── unit/                # Unit tests for components and logic
└── property/            # Property-based tests using fast-check
```

## Component Organization

### Static View Components
Located in `src/components/static/`:
- `StaticView.tsx` - Main container for Phase A
- `CustomerProfilePanel.tsx`
- `AccountSummaryPanel.tsx`
- `TransactionHistoryPanel.tsx`
- `RiskFraudPanel.tsx`
- `PreviousInteractionsPanel.tsx`
- `TelephonyControlsPanel.tsx`
- `AiAssistSidebar.tsx`

### Dynamic View Components
Located in `src/components/dynamic/`:
- `DynamicView.tsx` - Main container for Phase B
- `Header.tsx`
- `ConversationArea.tsx`
- `AiActivityFeed.tsx`
- `DynamicTileContainer.tsx`

### Tile Components
Located in `src/components/tiles/`:
- `ChangeAddressTile.tsx`
- `VerifyIdentityTile.tsx`
- `UpdateContactDetailsTile.tsx`
- `DisputeTransactionTile.tsx`

Each tile is self-contained with form fields, submit button, status indicator, and auto-populate capability.

### Shared Components
Located in `src/components/shared/`:
- `TranscriptPanel.tsx` - Used by both static and dynamic views

## State Management

- **React Context** for global state (TimelineContext, ViewContext)
- **Local component state** for tile forms, submission status, and UI-only state
- **Custom hooks** for reusable logic (e.g., `useTimeline` for timeline engine)

## Data Files

Located in `src/data/`:
- `static_timeline.json` - Timeline events for static view demo
- `dynamic_timeline.json` - Timeline events for dynamic view demo
- `mock_data.ts` - Mock customer, transaction, and risk data

## Routing

- `/static` - Static view demonstration (Phase A)
- `/dynamic` - Dynamic view demonstration (Phase B)

## Naming Conventions

- **Components**: PascalCase (e.g., `CustomerProfilePanel.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTimeline.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `TimelineEvent`)
- **Files**: Match component/export name
- **CSS**: Tailwind utility classes preferred; CSS modules if custom styles needed

## Import Patterns

- Absolute imports from `src/` root
- Group imports: React/external libraries → internal components → types → styles
- Named exports preferred for utilities; default exports for components
