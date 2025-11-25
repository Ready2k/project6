// Property-Based Tests for Timeline Event Ordering
// Feature: financial-agent-desktop-demo, Property 8: Timeline event ordering
// Validates: Requirements 4.5, 7.8

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useTimeline } from '../../src/hooks/useTimeline';
import type { TimelineEvent } from '../../src/types/timeline';

describe('Property 8: Timeline event ordering', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Generator for timeline events with random time offsets
  const timelineEventGenerator = fc.record({
    t: fc.nat({ max: 10000 }), // Time offset in milliseconds
    event: fc.constantFrom('transcript', 'ai_reasoning', 'panel_show', 'panel_hide', 'auto_populate'),
    speaker: fc.constantFrom('customer', 'agent'),
    text: fc.string({ minLength: 1, maxLength: 100 }),
    panel: fc.string({ minLength: 1, maxLength: 50 }),
    action: fc.string({ minLength: 1, maxLength: 50 }),
    reason: fc.string({ minLength: 1, maxLength: 100 }),
    data: fc.dictionary(fc.string(), fc.anything()),
  }).map((raw): TimelineEvent => {
    // Create properly typed events based on event type
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

  it('should process events in ascending order of time offset regardless of input order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(timelineEventGenerator, { minLength: 2, maxLength: 20 }),
        async (events) => {
          // Shuffle the events to ensure they're not in order
          const shuffledEvents = fc.sample(fc.shuffledSubarray(events, { minLength: events.length, maxLength: events.length }), 1)[0];

          const { result } = renderHook(() => useTimeline(shuffledEvents));

          // Start playback
          act(() => {
            result.current.play();
          });

          // Process all events by advancing time to the maximum time offset
          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // Collect all processed events with timestamps in the order they appear in the results
          // We need to merge transcripts and AI activities based on their actual processing order
          // Since both arrays are built by appending, we can verify each separately
          
          // Verify transcript timestamps are in ascending order
          const transcriptTimestamps = result.current.transcripts.map(t => t.timestamp);
          for (let i = 1; i < transcriptTimestamps.length; i++) {
            expect(transcriptTimestamps[i]).toBeGreaterThanOrEqual(transcriptTimestamps[i - 1]);
          }

          // Verify AI activity timestamps are in ascending order
          const aiActivityTimestamps = result.current.aiActivities.map(a => a.timestamp);
          for (let i = 1; i < aiActivityTimestamps.length; i++) {
            expect(aiActivityTimestamps[i]).toBeGreaterThanOrEqual(aiActivityTimestamps[i - 1]);
          }

          // Verify that all events were processed
          const transcriptCount = events.filter(e => e.event === 'transcript').length;
          const aiActivityCount = events.filter(e => 
            e.event === 'ai_reasoning' || 
            e.event === 'ai_action_attempt' || 
            e.event === 'ai_action_blocked'
          ).length;

          expect(result.current.transcripts).toHaveLength(transcriptCount);
          expect(result.current.aiActivities).toHaveLength(aiActivityCount);

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

  it('should maintain correct event order even with duplicate time offsets', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.nat({ max: 100 }), { minLength: 3, maxLength: 10 }),
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 3, maxLength: 10 }),
        async (timeOffsets, texts) => {
          // Create events with potentially duplicate time offsets
          const events: TimelineEvent[] = timeOffsets.slice(0, texts.length).map((t, i) => ({
            t,
            event: 'transcript',
            speaker: 'customer',
            text: texts[i],
          }));

          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...timeOffsets);
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // Verify all events were processed
          expect(result.current.transcripts).toHaveLength(events.length);

          // Verify timestamps are in non-decreasing order
          const timestamps = result.current.transcripts.map(t => t.timestamp);
          for (let i = 1; i < timestamps.length; i++) {
            expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
          }

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should process events with time offset 0 immediately', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(timelineEventGenerator, { minLength: 1, maxLength: 10 }),
        async (events) => {
          // Ensure at least one event has t=0 and it's a transcript event (which creates visible output)
          const firstEvent = events[0];
          const eventsWithZero: TimelineEvent[] = [
            {
              t: 0,
              event: 'transcript',
              speaker: 'customer',
              text: firstEvent.event === 'transcript' ? firstEvent.text : 'Test message',
            },
            ...events.slice(1),
          ];

          const { result } = renderHook(() => useTimeline(eventsWithZero));

          act(() => {
            result.current.play();
          });

          // Advance by 0 time - events at t=0 should process
          await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
          });

          // At least one transcript should have been processed (the one at t=0)
          expect(result.current.transcripts.length).toBeGreaterThan(0);
          expect(result.current.transcripts[0].timestamp).toBe(0);

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
