// Feature: financial-agent-desktop-demo, Property 3: Dynamic panel show/hide
// **Validates: Requirements 3.2, 3.3**
// Property: For any panel_show event followed by a panel_hide event for the same panel,
// the panel should be visible after the show event and not visible after the hide event.

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { useTimeline } from '../../src/hooks/useTimeline';
import type { TimelineEvent } from '../../src/types/timeline';

describe('Property 3: Dynamic panel show/hide', () => {
  it('should show panel after panel_show event and hide after panel_hide event', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a random panel name
        fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
        // Generate time offsets with enough spacing to account for auto-start delay
        fc.integer({ min: 50, max: 150 }),
        fc.integer({ min: 100, max: 200 }),
        async (panelName, showTime, hideDelay) => {
          const hideTime = showTime + hideDelay;

          // Create timeline with panel_show followed by panel_hide
          const timeline: TimelineEvent[] = [
            {
              t: showTime,
              event: 'panel_show',
              panel: panelName,
            },
            {
              t: hideTime,
              event: 'panel_hide',
              panel: panelName,
            },
          ];

          const { result, unmount } = renderHook(() => useTimeline(timeline));

          // Wait for the panel_show event to be processed (add buffer for auto-start delay + processing)
          await waitFor(
            () => {
              expect(result.current.visiblePanels.has(panelName)).toBe(true);
            },
            { timeout: showTime + 600 }
          );

          // Wait for the panel_hide event to be processed
          await waitFor(
            () => {
              expect(result.current.visiblePanels.has(panelName)).toBe(false);
            },
            { timeout: hideDelay + 600 }
          );

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 60000); // 60 second timeout for property test

  it('should handle multiple panels showing and hiding independently', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate two different panel names
        fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
        fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
        async (panel1, panel2) => {
          // Skip if panels are the same
          fc.pre(panel1 !== panel2);

          // Create timeline with both panels showing, then hiding panel1
          const timeline: TimelineEvent[] = [
            {
              t: 10,
              event: 'panel_show',
              panel: panel1,
            },
            {
              t: 30,
              event: 'panel_show',
              panel: panel2,
            },
            {
              t: 50,
              event: 'panel_hide',
              panel: panel1,
            },
          ];

          const { result, unmount } = renderHook(() => useTimeline(timeline));

          // Wait for both panels to show (increased timeout to account for auto-start delay)
          await waitFor(
            () => {
              expect(result.current.visiblePanels.has(panel1)).toBe(true);
              expect(result.current.visiblePanels.has(panel2)).toBe(true);
            },
            { timeout: 1000 }
          );

          // Wait for panel1 to hide (panel2 should still be visible)
          await waitFor(
            () => {
              expect(result.current.visiblePanels.has(panel1)).toBe(false);
              expect(result.current.visiblePanels.has(panel2)).toBe(true);
            },
            { timeout: 1000 }
          );

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // 30 second timeout for property test

  it('should handle show/hide events in any order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
        fc.array(
          fc.record({
            action: fc.constantFrom('show', 'hide'),
            delay: fc.integer({ min: 5, max: 20 }),
          }),
          { minLength: 2, maxLength: 6 }
        ),
        async (panelName, actions) => {
          let currentTime = 0;
          const timeline: TimelineEvent[] = [];

          for (const action of actions) {
            currentTime += action.delay;
            timeline.push({
              t: currentTime,
              event: action.action === 'show' ? 'panel_show' : 'panel_hide',
              panel: panelName,
            } as TimelineEvent);
          }

          const { result, unmount } = renderHook(() => useTimeline(timeline));

          // Determine expected final state
          let isVisible = false;
          for (const action of actions) {
            if (action.action === 'show') {
              isVisible = true;
            } else {
              isVisible = false;
            }
          }

          // Wait for all events to process
          await waitFor(
            () => {
              expect(result.current.visiblePanels.has(panelName)).toBe(isVisible);
            },
            { timeout: currentTime + 500 }
          );

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000); // 30 second timeout for property test
});
