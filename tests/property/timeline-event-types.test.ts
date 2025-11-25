// Property-Based Tests for Timeline Engine Event Type Handling
// Feature: financial-agent-desktop-demo, Property 9: Timeline engine handles all event types
// Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useTimeline } from '../../src/hooks/useTimeline';
import type { TimelineEvent } from '../../src/types/timeline';

describe('Property 9: Timeline engine handles all event types', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Generator for transcript events (Requirement 7.1)
  const transcriptEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    speaker: fc.constantFrom('customer', 'agent'),
    text: fc.string({ minLength: 1, maxLength: 200 }),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'transcript',
    speaker: raw.speaker,
    text: raw.text,
  }));

  // Generator for ai_reasoning events (Requirement 7.2)
  const aiReasoningEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    text: fc.string({ minLength: 1, maxLength: 200 }),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'ai_reasoning',
    text: raw.text,
  }));

  // Generator for ai_action_attempt events (Requirement 7.3)
  const aiActionAttemptEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    action: fc.string({ minLength: 1, maxLength: 100 }),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'ai_action_attempt',
    action: raw.action,
  }));

  // Generator for ai_action_blocked events (Requirement 7.4)
  const aiActionBlockedEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    action: fc.string({ minLength: 1, maxLength: 100 }),
    reason: fc.string({ minLength: 1, maxLength: 200 }),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'ai_action_blocked',
    action: raw.action,
    reason: raw.reason,
  }));

  // Generator for panel_show events (Requirement 7.5)
  const panelShowEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    panel: fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'panel_show',
    panel: raw.panel,
  }));

  // Generator for panel_hide events (Requirement 7.6)
  const panelHideEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    panel: fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'panel_hide',
    panel: raw.panel,
  }));

  // Generator for auto_populate events (Requirement 7.7)
  const autoPopulateEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    panel: fc.constantFrom('changeAddress', 'verifyIdentity', 'updateContactDetails', 'disputeTransaction'),
    data: fc.dictionary(
      fc.string({ minLength: 1, maxLength: 20 }),
      fc.oneof(
        fc.string({ minLength: 0, maxLength: 100 }),
        fc.integer(),
        fc.boolean()
      )
    ),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'auto_populate',
    panel: raw.panel,
    data: raw.data,
  }));

  // Combined generator for all event types
  const anyTimelineEventGenerator = fc.oneof(
    transcriptEventGenerator,
    aiReasoningEventGenerator,
    aiActionAttemptEventGenerator,
    aiActionBlockedEventGenerator,
    panelShowEventGenerator,
    panelHideEventGenerator,
    autoPopulateEventGenerator
  );

  it('should process all event types without errors', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(anyTimelineEventGenerator, { minLength: 1, maxLength: 30 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          // Start playback
          act(() => {
            result.current.play();
          });

          // Process all events
          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // Verify no errors occurred by checking that the hook is still functional
          expect(result.current).toBeDefined();
          expect(result.current.transcripts).toBeDefined();
          expect(result.current.aiActivities).toBeDefined();
          expect(result.current.visiblePanels).toBeDefined();
          expect(result.current.tileData).toBeDefined();

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

  it('should correctly process transcript events', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(transcriptEventGenerator, { minLength: 1, maxLength: 20 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            // Advance by maxTime + 200 to account for auto-start delay (100ms) and processing time
            await vi.advanceTimersByTimeAsync(maxTime + 200);
          });

          // All transcript events should be in the transcripts array
          expect(result.current.transcripts).toHaveLength(events.length);

          // Each transcript should have the correct properties
          events.forEach((event, index) => {
            const transcript = result.current.transcripts.find(
              t => t.text === (event as any).text && t.speaker === (event as any).speaker
            );
            expect(transcript).toBeDefined();
            expect(transcript?.timestamp).toBe(event.t);
          });

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should correctly process ai_reasoning events', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(aiReasoningEventGenerator, { minLength: 1, maxLength: 20 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // All ai_reasoning events should be in the aiActivities array
          const reasoningActivities = result.current.aiActivities.filter(a => a.type === 'reasoning');
          expect(reasoningActivities).toHaveLength(events.length);

          // Each activity should have the correct properties
          events.forEach((event) => {
            const activity = reasoningActivities.find(a => a.text === (event as any).text);
            expect(activity).toBeDefined();
            expect(activity?.type).toBe('reasoning');
            expect(activity?.timestamp).toBe(event.t);
          });

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should correctly process ai_action_attempt events', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(aiActionAttemptEventGenerator, { minLength: 1, maxLength: 20 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // All ai_action_attempt events should be in the aiActivities array
          const attemptActivities = result.current.aiActivities.filter(a => a.type === 'action_attempt');
          expect(attemptActivities).toHaveLength(events.length);

          // Each activity should have the correct properties
          events.forEach((event) => {
            const activity = attemptActivities.find(a => a.action === (event as any).action);
            expect(activity).toBeDefined();
            expect(activity?.type).toBe('action_attempt');
            expect(activity?.timestamp).toBe(event.t);
          });

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should correctly process ai_action_blocked events', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(aiActionBlockedEventGenerator, { minLength: 1, maxLength: 20 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // All ai_action_blocked events should be in the aiActivities array
          const blockedActivities = result.current.aiActivities.filter(a => a.type === 'action_blocked');
          expect(blockedActivities).toHaveLength(events.length);

          // Each activity should have the correct properties
          events.forEach((event) => {
            const activity = blockedActivities.find(
              a => a.action === (event as any).action && a.reason === (event as any).reason
            );
            expect(activity).toBeDefined();
            expect(activity?.type).toBe('action_blocked');
            expect(activity?.timestamp).toBe(event.t);
          });

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should correctly process panel_show events', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(panelShowEventGenerator, { minLength: 1, maxLength: 20 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // All unique panels from panel_show events should be visible
          const uniquePanels = new Set(events.map(e => (e as any).panel));
          uniquePanels.forEach(panel => {
            expect(result.current.visiblePanels.has(panel)).toBe(true);
          });

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should correctly process panel_hide events', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(panelHideEventGenerator, { minLength: 1, maxLength: 20 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          // First show all panels that will be hidden
          const uniquePanels = new Set(events.map(e => (e as any).panel));
          const showEvents: TimelineEvent[] = Array.from(uniquePanels).map(panel => ({
            t: 0,
            event: 'panel_show',
            panel,
          }));

          const combinedEvents = [...showEvents, ...events];
          const { result: result2 } = renderHook(() => useTimeline(combinedEvents));

          act(() => {
            result2.current.play();
          });

          const maxTime = Math.max(...combinedEvents.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // All panels should be hidden after panel_hide events
          uniquePanels.forEach(panel => {
            expect(result2.current.visiblePanels.has(panel)).toBe(false);
          });

          act(() => {
            result2.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should correctly process auto_populate events', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(autoPopulateEventGenerator, { minLength: 1, maxLength: 20 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // Each auto_populate event should populate tileData
          events.forEach((event) => {
            const panel = (event as any).panel;
            const data = (event as any).data;
            
            expect(result.current.tileData[panel]).toBeDefined();
            // The last event for each panel should be the current data
            // (since multiple events might target the same panel)
          });

          // Verify that all unique panels have data
          const uniquePanels = new Set(events.map(e => (e as any).panel));
          expect(Object.keys(result.current.tileData).length).toBeGreaterThanOrEqual(uniquePanels.size);

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should handle mixed event types in a single timeline', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(anyTimelineEventGenerator, { minLength: 5, maxLength: 30 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // Count expected events by type
          const transcriptCount = events.filter(e => e.event === 'transcript').length;
          const aiReasoningCount = events.filter(e => e.event === 'ai_reasoning').length;
          const aiActionAttemptCount = events.filter(e => e.event === 'ai_action_attempt').length;
          const aiActionBlockedCount = events.filter(e => e.event === 'ai_action_blocked').length;
          const panelShowCount = events.filter(e => e.event === 'panel_show').length;
          const autoPopulateCount = events.filter(e => e.event === 'auto_populate').length;

          // Verify correct counts
          expect(result.current.transcripts).toHaveLength(transcriptCount);
          
          const reasoningActivities = result.current.aiActivities.filter(a => a.type === 'reasoning');
          const attemptActivities = result.current.aiActivities.filter(a => a.type === 'action_attempt');
          const blockedActivities = result.current.aiActivities.filter(a => a.type === 'action_blocked');
          
          expect(reasoningActivities).toHaveLength(aiReasoningCount);
          expect(attemptActivities).toHaveLength(aiActionAttemptCount);
          expect(blockedActivities).toHaveLength(aiActionBlockedCount);

          // Verify visible panels (accounting for show/hide interactions in order)
          const sortedEvents = [...events].sort((a, b) => a.t - b.t);
          const expectedVisiblePanels = new Set<string>();
          
          sortedEvents.forEach(e => {
            if (e.event === 'panel_show') {
              expectedVisiblePanels.add((e as any).panel);
            } else if (e.event === 'panel_hide') {
              expectedVisiblePanels.delete((e as any).panel);
            }
          });
          
          expect(result.current.visiblePanels.size).toBe(expectedVisiblePanels.size);
          expectedVisiblePanels.forEach(panel => {
            expect(result.current.visiblePanels.has(panel)).toBe(true);
          });

          // Verify auto_populate data exists for unique panels
          const autoPopulateEvents = events.filter(e => e.event === 'auto_populate') as any[];
          const uniqueAutoPopulatePanels = new Set(autoPopulateEvents.map(e => e.panel));
          expect(Object.keys(result.current.tileData).length).toBe(uniqueAutoPopulatePanels.size);

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
