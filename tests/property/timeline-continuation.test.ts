// Property-Based Tests for Timeline Continuation After Tile Submission
// Feature: financial-agent-desktop-demo, Property 7: Timeline continues after tile submission
// Validates: Requirements 5.5

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useTimeline } from '../../src/hooks/useTimeline';
import type { TimelineEvent } from '../../src/types/timeline';

describe('Property 7: Timeline continues after tile submission', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Generator for timeline events
  const timelineEventGenerator = fc.record({
    t: fc.nat({ max: 10000 }),
    event: fc.constantFrom('transcript', 'ai_reasoning', 'panel_show', 'panel_hide', 'auto_populate'),
    speaker: fc.constantFrom('customer', 'agent'),
    text: fc.string({ minLength: 1, maxLength: 100 }),
    panel: fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
    data: fc.dictionary(fc.string(), fc.string()),
  }).map((raw): TimelineEvent => {
    switch (raw.event) {
      case 'transcript':
        return {
          t: raw.t,
          event: 'transcript',
          speaker: raw.speaker,
          text: raw.text,
        };
      case 'ai_reasoning':
        return {
          t: raw.t,
          event: 'ai_reasoning',
          text: raw.text,
        };
      case 'panel_show':
        return {
          t: raw.t,
          event: 'panel_show',
          panel: raw.panel,
        };
      case 'panel_hide':
        return {
          t: raw.t,
          event: 'panel_hide',
          panel: raw.panel,
        };
      case 'auto_populate':
        return {
          t: raw.t,
          event: 'auto_populate',
          panel: raw.panel,
          data: raw.data,
        };
      default:
        return {
          t: raw.t,
          event: 'transcript',
          speaker: 'customer',
          text: raw.text,
        };
    }
  });

  it('should continue processing events after tile submission', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
        fc.array(timelineEventGenerator, { minLength: 2, maxLength: 10 }), // Events after submission
        async (panelName, eventsAfterSubmission) => {
          // Create a timeline with:
          // 1. Panel show event at t=0
          // 2. Auto-populate event at t=50
          // 3. (User submits tile at t=200 - simulated)
          // 4. Events that should continue after submission starting at t=1000
          
          const submissionTime = 200;
          
          const eventsBeforeSubmission: TimelineEvent[] = [
            {
              t: 0,
              event: 'panel_show',
              panel: panelName,
            },
            {
              t: 50,
              event: 'auto_populate',
              panel: panelName,
              data: { field1: 'value1', field2: 'value2' },
            },
          ];

          // Ensure events after submission have time offsets well after submission completes
          const adjustedEventsAfter = eventsAfterSubmission.map((event, index) => ({
            ...event,
            t: 1000 + (index * 100), // Start well after submission time and completion
          }));

          const allEvents = [...eventsBeforeSubmission, ...adjustedEventsAfter];

          const { result } = renderHook(() => useTimeline(allEvents));

          // Start timeline playback
          act(() => {
            result.current.play();
          });

          // Advance to submission time (after auto-populate)
          await act(async () => {
            await vi.advanceTimersByTimeAsync(submissionTime);
          });

          // Verify panel is visible
          expect(result.current.visiblePanels.has(panelName)).toBe(true);

          // Simulate tile submission
          act(() => {
            result.current.handleTileSubmit(panelName, { field1: 'value1', field2: 'value2' });
          });

          // Advance time to allow submission to complete (500ms for the setTimeout in handleTileSubmit)
          await act(async () => {
            await vi.advanceTimersByTimeAsync(600);
          });

          // Verify tile status transitioned to completed
          expect(result.current.tileStatuses[panelName]).toBe('completed');

          // Count events before advancing to process events after submission
          const transcriptsBeforeAdvance = result.current.transcripts.length;
          const activitiesBeforeAdvance = result.current.aiActivities.length;

          // Advance time to process all remaining events (events start at t=1000, we're at t=800)
          const maxTime = Math.max(...allEvents.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 1000);
          });

          // Verify that events after submission were processed
          const transcriptsAfterAdvance = result.current.transcripts.length;
          const activitiesAfterAdvance = result.current.aiActivities.length;

          // Count expected events after submission
          const expectedTranscriptsAfter = adjustedEventsAfter.filter(e => e.event === 'transcript').length;
          const expectedActivitiesAfter = adjustedEventsAfter.filter(e => 
            e.event === 'ai_reasoning' || 
            e.event === 'ai_action_attempt' || 
            e.event === 'ai_action_blocked'
          ).length;

          // Verify new events were added
          expect(transcriptsAfterAdvance - transcriptsBeforeAdvance).toBe(expectedTranscriptsAfter);
          expect(activitiesAfterAdvance - activitiesBeforeAdvance).toBe(expectedActivitiesAfter);

          // Cleanup
          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should not pause timeline when tile is submitted', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
        fc.dictionary(fc.string(), fc.string()),
        async (panelName, formData) => {
          // Create a timeline with events spread across time
          const events: TimelineEvent[] = [
            {
              t: 0,
              event: 'panel_show',
              panel: panelName,
            },
            {
              t: 100,
              event: 'transcript',
              speaker: 'customer',
              text: 'First message',
            },
            {
              t: 200,
              event: 'transcript',
              speaker: 'agent',
              text: 'Second message',
            },
            {
              t: 300,
              event: 'transcript',
              speaker: 'customer',
              text: 'Third message',
            },
          ];

          const { result } = renderHook(() => useTimeline(events));

          // Start timeline
          act(() => {
            result.current.play();
          });

          // Advance to middle of timeline
          await act(async () => {
            await vi.advanceTimersByTimeAsync(150);
          });

          // Verify timeline is playing
          expect(result.current.isPlaying).toBe(true);
          expect(result.current.transcripts.length).toBeGreaterThan(0);

          // Submit tile
          act(() => {
            result.current.handleTileSubmit(panelName, formData);
          });

          // Timeline should still be playing
          expect(result.current.isPlaying).toBe(true);

          // Advance time to process remaining events
          await act(async () => {
            await vi.advanceTimersByTimeAsync(500);
          });

          // All events should have been processed
          expect(result.current.transcripts.length).toBe(3);

          // Cleanup
          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should allow multiple tile submissions without blocking timeline', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
          { minLength: 2, maxLength: 4 }
        ),
        async (panelNames) => {
          // Create unique panel names to avoid conflicts
          const uniquePanels = Array.from(new Set(panelNames));
          
          // Create timeline with multiple panels shown and events after
          const events: TimelineEvent[] = [
            ...uniquePanels.map((panel, index) => ({
              t: index * 100,
              event: 'panel_show' as const,
              panel,
            })),
            {
              t: uniquePanels.length * 100 + 500,
              event: 'transcript' as const,
              speaker: 'customer' as const,
              text: 'Final message',
            },
          ];

          const { result } = renderHook(() => useTimeline(events));

          // Start timeline
          act(() => {
            result.current.play();
          });

          // Advance to show all panels
          await act(async () => {
            await vi.advanceTimersByTimeAsync(uniquePanels.length * 100 + 100);
          });

          // Submit all tiles
          for (const panel of uniquePanels) {
            act(() => {
              result.current.handleTileSubmit(panel, { test: 'data' });
            });
          }

          // Timeline should still be playing
          expect(result.current.isPlaying).toBe(true);

          // Advance to process final event
          await act(async () => {
            await vi.advanceTimersByTimeAsync(1000);
          });

          // Final event should have been processed
          expect(result.current.transcripts.length).toBe(1);
          expect(result.current.transcripts[0].text).toBe('Final message');

          // All tiles should be completed
          for (const panel of uniquePanels) {
            expect(result.current.tileStatuses[panel]).toBe('completed');
          }

          // Cleanup
          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should process events immediately after tile submission without delay', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
        fc.string({ minLength: 1, maxLength: 100 }),
        async (panelName, messageText) => {
          // Create timeline where an event occurs right after submission time
          const events: TimelineEvent[] = [
            {
              t: 0,
              event: 'panel_show',
              panel: panelName,
            },
            {
              t: 100,
              event: 'transcript',
              speaker: 'customer',
              text: messageText,
            },
          ];

          const { result } = renderHook(() => useTimeline(events));

          // Start timeline
          act(() => {
            result.current.play();
          });

          // Advance to just before the transcript event
          await act(async () => {
            await vi.advanceTimersByTimeAsync(50);
          });

          // Submit tile
          act(() => {
            result.current.handleTileSubmit(panelName, { test: 'data' });
          });

          // Advance to process the transcript event
          await act(async () => {
            await vi.advanceTimersByTimeAsync(100);
          });

          // Transcript event should have been processed despite tile submission
          expect(result.current.transcripts.length).toBe(1);
          expect(result.current.transcripts[0].text).toBe(messageText);

          // Cleanup
          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });
});
