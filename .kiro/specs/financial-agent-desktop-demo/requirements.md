# Requirements Document

## Introduction

This specification defines a two-stage demonstration web application showcasing the evolution from a static financial-services agent desktop (current state) to a dynamic AI-orchestrated agent desktop (future state). The application demonstrates how AI can intelligently orchestrate UI components based on conversation context, moving from a cluttered, always-visible interface to a clean, context-aware workspace.

## Glossary

- **Agent Desktop**: The web application interface used by customer service agents to handle customer interactions
- **Static UI**: Phase A implementation where all UI panels remain visible and fixed throughout the interaction
- **Dynamic UI**: Phase B implementation where UI panels appear and disappear based on AI-driven events
- **Tile**: A modular UI component representing a specific task or information panel (e.g., Change Address, Verify Identity)
- **Timeline**: A JSON file containing time-sequenced events that drive the demonstration
- **AI Activity Feed**: A UI component displaying AI reasoning, actions, and status updates
- **Transcript Panel**: A UI component displaying the conversation between customer and agent
- **Auto-populate**: An AI-driven action that fills form fields with suggested values
- **Mock Data**: Simulated data used for demonstration purposes without real backend integration

## Requirements

### Requirement 1

**User Story:** As a stakeholder, I want to see a static agent desktop interface, so that I can understand the current state of agent tooling with all panels always visible.

#### Acceptance Criteria

1. WHEN the application loads the /static route THEN the Agent Desktop SHALL display all fixed panels simultaneously
2. THE Agent Desktop SHALL display a Customer Profile panel with mock customer data
3. THE Agent Desktop SHALL display an Account Summary panel with mock account information
4. THE Agent Desktop SHALL display a Transaction History panel with mock transaction records
5. THE Agent Desktop SHALL display a Risk/Fraud Indicators panel with mock risk data
6. THE Agent Desktop SHALL display a Previous Interactions panel with mock interaction history
7. THE Agent Desktop SHALL display Telephony/Chat Controls as non-functional UI elements
8. WHILE the static demo runs THE Agent Desktop SHALL maintain all panels in fixed positions without hiding or rearranging

### Requirement 2

**User Story:** As a stakeholder, I want to see an AI Assist Sidebar in the static view, so that I can understand how AI provides real-time guidance to agents.

#### Acceptance Criteria

1. WHEN the static demo runs THEN the Agent Desktop SHALL display an AI Assist Sidebar
2. WHEN transcript events occur THEN the AI Assist Sidebar SHALL display conversation text progressively
3. WHEN sentiment data is provided THEN the AI Assist Sidebar SHALL display sentiment indicators
4. WHEN suggestion data is provided THEN the AI Assist Sidebar SHALL display suggested prompts and guidance
5. THE Agent Desktop SHALL load transcript data from a JSON timeline file

### Requirement 3

**User Story:** As a stakeholder, I want to see a dynamic agent desktop interface, so that I can understand the future state where AI orchestrates UI components contextually.

#### Acceptance Criteria

1. WHEN the application loads the /dynamic route THEN the Agent Desktop SHALL display a minimal interface with header, conversation area, AI Activity Feed, and empty dynamic tiles container
2. WHEN panel_show events occur THEN the Agent Desktop SHALL dynamically mount and display the specified tile component
3. WHEN panel_hide events occur THEN the Agent Desktop SHALL remove the specified tile component from view
4. THE Agent Desktop SHALL support Change Address tile with mock form fields
5. THE Agent Desktop SHALL support Verify Identity tile with mock form fields
6. THE Agent Desktop SHALL support Update Contact Details tile with mock form fields
7. THE Agent Desktop SHALL support Dispute Transaction tile with mock form fields

### Requirement 4

**User Story:** As a stakeholder, I want to see AI activity and reasoning in the dynamic view, so that I can understand how AI makes decisions about which UI components to show.

#### Acceptance Criteria

1. WHEN transcript events occur THEN the Agent Desktop SHALL display conversation text in the conversation area
2. WHEN ai_reasoning events occur THEN the Agent Desktop SHALL display reasoning text in the AI Activity Feed
3. WHEN ai_action_attempt events occur THEN the Agent Desktop SHALL display action attempt messages in the AI Activity Feed
4. WHEN ai_action_blocked events occur THEN the Agent Desktop SHALL display blocked action messages in the AI Activity Feed
5. THE Agent Desktop SHALL process events from a JSON timeline file sequentially with time-based delays

### Requirement 5

**User Story:** As a stakeholder, I want to see AI auto-populate form fields, so that I can understand how AI assists agents by pre-filling information.

#### Acceptance Criteria

1. WHEN auto_populate events occur THEN the Agent Desktop SHALL fill the specified tile form fields with provided data
2. WHEN form fields are auto-populated THEN the Agent Desktop SHALL provide visual indication that values were AI-suggested
3. WHEN a user clicks a submit button on a tile THEN the Agent Desktop SHALL execute a mock submission function
4. WHEN a tile submission completes THEN the Agent Desktop SHALL update the tile status to indicate completion
5. WHEN a tile submission completes THEN the Agent Desktop SHALL allow the timeline to continue processing subsequent events

### Requirement 6

**User Story:** As a developer, I want a simple React application structure, so that I can easily run and modify the demonstration.

#### Acceptance Criteria

1. THE Agent Desktop SHALL be implemented using React and Vite
2. THE Agent Desktop SHALL provide a /static route for Phase A demonstration
3. THE Agent Desktop SHALL provide a /dynamic route for Phase B demonstration
4. WHEN a developer runs npm install and npm run dev THEN the Agent Desktop SHALL start successfully
5. THE Agent Desktop SHALL load timeline data from JSON files in the data directory
6. THE Agent Desktop source code SHOULD be organised using a clear directory structure, for example:
/src/components/static
/src/components/dynamic
/src/tiles
/src/data for timeline JSON files

### Requirement 7

**User Story:** As a developer, I want timeline events to drive the demonstration, so that I can easily modify scenarios without changing code.

#### Acceptance Criteria

1. THE Agent Desktop SHALL support transcript event type with text property
2. THE Agent Desktop SHALL support ai_reasoning event type with text property
3. THE Agent Desktop SHALL support ai_action_attempt event type with action property
4. THE Agent Desktop SHALL support ai_action_blocked event type with action and reason properties
5. THE Agent Desktop SHALL support panel_show event type with panel property
6. THE Agent Desktop SHALL support panel_hide event type with panel property
7. THE Agent Desktop SHALL support auto_populate event type with panel and data properties
8. WHEN processing timeline events THEN the Agent Desktop SHALL respect the time offset specified in each event
Example Timeline Event Schema (Informative)
{
  "t": 0,
  "type": "transcript",
  "text": "Customer: I'd like to change my address"
}
{
  "t": 5,
  "type": "panel_show",
  "panel": "changeAddress"
}
{
  "t": 8,
  "type": "auto_populate",
  "panel": "changeAddress",
  "data": {
    "newAddress": "10 High Street, London",
    "postcode": "E1 1AA"
  }
}
### Requirement 8

**User Story:** As a stakeholder, I want the demonstration to use only mock data, so that I can see the concept without requiring real integrations.

#### Acceptance Criteria

1. THE Agent Desktop SHALL NOT make external API calls
2. THE Agent Desktop SHALL NOT integrate with real telephony systems
3. THE Agent Desktop SHALL NOT integrate with real CRM systems
4. THE Agent Desktop SHALL NOT require authentication
5. THE Agent Desktop SHALL NOT require a database
6. THE Agent Desktop SHALL use mock data for all customer information, transactions, and interactions

### Requirement 9
***User Story:*** As a stakeholder, I want the demonstration UI to be clear and easy to understand, so that I can visually compare the static and dynamic approaches.
### Acceptance Criteria
1. THE Agent Desktop SHALL visually distinguish between the static and dynamic views (e.g., clear titles or headers indicating “Current State” and “Future State”).
2. THE Agent Desktop SHALL use a consistent layout, spacing, and typography across panels and tiles.
3. THE Agent Desktop SHALL clearly label each tile (e.g., “Change Address”, “Verify Identity”).
4. THE Agent Desktop SHALL visibly indicate when a tile has been completed (e.g., status text or visual badge).