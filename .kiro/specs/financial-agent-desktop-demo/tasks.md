# Implementation Plan
all implementation MUST strictly follow the design document and requirements specification. Do not introduce new panels, tiles, event types, libraries, or architectural patterns. No inventive deviations.
- [x] 1. Set up project structure and dependencies
  - Initialize Vite + React + TypeScript project
  - Install dependencies: react-router-dom, fast-check, vitest, @testing-library/react
  - Configure Tailwind CSS for styling
  - Create directory structure for components, hooks, types, data, and tests
  - _Requirements: 6.1, 6.4_

- [x] 2. Define TypeScript types and interfaces
  - Create timeline event type definitions (TranscriptEvent, AiReasoningEvent, PanelShowEvent, etc.)
  - Create mock data model interfaces (Customer, Transaction, RiskIndicator)
  - Create component prop interfaces (TileProps, TimelineState)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 3. Implement timeline engine hook
  - Create useTimeline custom hook that accepts timeline data
  - Implement event sorting by time offset
  - Implement sequential event processing with time-based delays
  - Implement timeline state inside the hook and expose it via returned object
  - Ensure downstream components only receive state via hook return values
  - Implement state management for transcripts, AI activities, visible panels, and tile data
  - Add play/pause/reset controls
  - _Requirements: 4.5, 7.8_

- [x] 3.1 Write property test for timeline event ordering
  - **Property 8: Timeline event ordering**
  - **Validates: Requirements 4.5, 7.8**

- [x] 3.2 Write property test for timeline engine event type handling
  - **Property 9: Timeline engine handles all event types**
  - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7**

- [x] 4. Create mock data and timeline files
  - Create mock customer data (profiles, accounts, transactions, risk indicators, interactions)
  - Create static_timeline.json with events for Phase A demo
  - Create dynamic_timeline.json with events for Phase B demo including panel_show, auto_populate, and AI reasoning
  - _Requirements: 2.5, 6.5, 8.6_

- [x] 5. Implement shared components
  - Create TranscriptPanel component with progressive text rendering
  - Add speaker identification (Customer/Agent)
  - Add timestamp display
  - _Requirements: 2.2, 4.1_

- [x] 5.1 Write property test for event-to-UI rendering
  - **Property 2: Event-to-UI rendering consistency**
  - **Validates: Requirements 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4**

- [x] 6. Implement tile components
  - Create ChangeAddressTile with form fields (street, city, state, zip)
  - Create VerifyIdentityTile with form fields (ID type, ID number, verification method)
  - Create UpdateContactDetailsTile with form fields (phone, email, preferred contact method)
  - Create DisputeTransactionTile with form fields (transaction ID, reason, amount)
  - Add submit button and status indicator to each tile
  - Implement onSubmit callback handling
  - _Requirements: 3.4, 3.5, 3.6, 3.7, 5.3_

- [x] 6.1 Write property test for tile submission status updates
  - **Property 6: Tile submission updates status**
  - **Validates: Requirements 5.3, 5.4**

- [x] 7. Implement auto-populate functionality for tiles
  - Add data prop to tile components
  - Implement form field population from data prop
  - Add visual indicators (CSS class or styling) for auto-populated fields
  - _Requirements: 5.1, 5.2_

- [x] 7.1 Write property test for auto-populate fills form fields
  - **Property 4: Auto-populate fills form fields**
  - **Validates: Requirements 5.1**

- [x] 7.2 Write property test for auto-populated field visual indicators
  - **Property 5: Auto-populated fields have visual indicators**
  - **Validates: Requirements 5.2**

- [x] 8. Implement Static View (Phase A)
  - Create StaticView container component
  - Create CustomerProfilePanel with mock customer data display
  - Create AccountSummaryPanel with mock account information
  - Create TransactionHistoryPanel with mock transaction list
  - Create RiskFraudPanel with mock risk indicators
  - Create PreviousInteractionsPanel with mock interaction history
  - Create TelephonyControlsPanel with non-functional UI buttons
  - Create AiAssistSidebar with transcript, sentiment, and suggestions display
  - Wire up timeline engine to update AI sidebar
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.3, 2.4_

- [x] 8.1 Write unit test for static view panel rendering
  - Test that all required panels are present when StaticView renders
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 8.2 Write property test for static view panel persistence
  - **Property 1: Static view panel persistence**
  - **Validates: Requirements 1.8**

- [x] 9. Implement Dynamic View (Phase B)
  - Create DynamicView container component with minimal initial layout
  - Create Header component
  - Create ConversationArea component for transcript display
  - Create AiActivityFeed component for AI reasoning and actions
  - Create DynamicTileContainer component for dynamic tile mounting
  - Wire up timeline engine to handle panel_show and panel_hide events
  - Implement dynamic tile mounting/unmounting based on events
  - _Requirements: 3.1, 3.2, 3.3, 4.2, 4.3, 4.4_

- [x] 9.1 Write unit test for dynamic view initial rendering
  - Test that minimal interface elements are present on load
  - _Requirements: 3.1_

- [x] 9.2 Write property test for dynamic panel show/hide
  - **Property 3: Dynamic panel show/hide**
  - **Validates: Requirements 3.2, 3.3**

- [x] 10. Implement timeline continuation after tile submission
  - Ensure timeline engine doesn't pause when tile is submitted
  - Add mechanism to resume event processing after user interactions
  - Test that subsequent events fire after tile submission
  - _Requirements: 5.5_

- [x] 10.1 Write property test for timeline continuation
  - **Property 7: Timeline continues after tile submission**
  - **Validates: Requirements 5.5**

- [x] 11. Set up routing and main App component
  - Configure React Router with /static and /dynamic routes
  - Create App component with route definitions
  - Add navigation UI (optional: simple nav bar or links)
  - Load appropriate timeline data for each route
  - _Requirements: 6.2, 6.3_

- [x] 11.1 Write unit test for route configuration
  - Test that /static and /dynamic routes are accessible
  - _Requirements: 6.2, 6.3_

- [x] 12. Implement error handling
  - Add timeline loading error handling (malformed JSON, missing file)
  - Add event processing error handling (unrecognized event type, missing properties)
  - Add tile interaction error handling (invalid auto_populate, submission failures)
  - Add graceful degradation for missing mock data
  - Display user-friendly error messages where appropriate

- [x] 12.1 Write unit tests for error handling
  - Test malformed timeline JSON handling
  - Test unrecognized event type handling
  - Test missing panel name handling

- [x] 13. Polish UI and styling
  - Apply Tailwind CSS styling to all components
  - Ensure static view looks busy with all panels visible
  - Ensure dynamic view looks clean and minimal initially
  - Add smooth transitions for dynamic tile appearance/disappearance
  - Add visual distinction for auto-populated fields
  - Ensure responsive layout (desktop-focused)
  - Add basic accessibility attributes (ARIA labels, semantic HTML)

- [x] 14. Create README documentation
  - Document how to install dependencies (npm install)
  - Document how to run the application (npm run dev)
  - Explain the two routes (/static and /dynamic)
  - Explain how timeline files drive the demonstrations
  - Provide instructions for modifying timelines
  - Provide instructions for adding new tiles
  - Include project structure overview

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
