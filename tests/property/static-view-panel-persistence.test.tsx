import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import StaticView from '../../src/components/static/StaticView';
import { TimelineEvent } from '../../src/types/timeline';

// Feature: financial-agent-desktop-demo, Property 1: Static view panel persistence
// **Validates: Requirements 1.8**

describe('Property 1: Static view panel persistence', () => {
  it('should maintain all panels visible throughout timeline execution', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate random timeline with transcript events
        fc.array(
          fc.record({
            t: fc.nat(30000), // Time offset up to 30 seconds
            event: fc.constant('transcript' as const),
            speaker: fc.constantFrom('customer' as const, 'agent' as const),
            text: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        async (events: TimelineEvent[]) => {
          // Arrange
          const { unmount } = render(<StaticView timelineData={events} />);

          // Define the expected panels that should always be visible
          const expectedPanels = [
            'Customer Profile',
            'Account Summary',
            'Transaction History',
            'Risk & Fraud Indicators',
            'Previous Interactions',
            'Telephony Controls',
            'AI Assist',
          ];

          // Act & Assert - Check panels are present at start
          for (const panelName of expectedPanels) {
            expect(screen.getByText(panelName)).toBeInTheDocument();
          }

          // Wait a bit for timeline to process some events
          await waitFor(
            () => {
              // Check panels are still present during execution
              for (const panelName of expectedPanels) {
                expect(screen.getByText(panelName)).toBeInTheDocument();
              }
            },
            { timeout: 1000 }
          );

          // Cleanup
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
