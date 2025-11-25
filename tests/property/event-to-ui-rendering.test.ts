// Property-Based Tests for Event-to-UI Rendering Consistency
// Feature: financial-agent-desktop-demo, Property 2: Event-to-UI rendering consistency
// Validates: Requirements 2.2, 2.3, 2.4, 4.1, 4.2, 4.3, 4.4

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { useTimeline } from '../../src/hooks/useTimeline';
import type { TimelineEvent } from '../../src/types/timeline';

describe('Property 2: Event-to-UI rendering consistency', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Generator for transcript events (Requirements 2.2, 4.1)
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

  // Generator for ai_reasoning events (Requirements 2.3, 4.2)
  const aiReasoningEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    text: fc.string({ minLength: 1, maxLength: 200 }),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'ai_reasoning',
    text: raw.text,
  }));

  // Generator for ai_action_attempt events (Requirements 2.4, 4.3)
  const aiActionAttemptEventGenerator = fc.record({
    t: fc.nat({ max: 5000 }),
    action: fc.string({ minLength: 1, maxLength: 100 }),
  }).map((raw): TimelineEvent => ({
    t: raw.t,
    event: 'ai_action_attempt',
    action: raw.action,
  }));

  // Generator for ai_action_blocked events (Requirements 2.4, 4.4)
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

  // Combined generator for UI-relevant events
  const uiEventGenerator = fc.oneof(
    transcriptEventGenerator,
    aiReasoningEventGenerator,
    aiActionAttemptEventGenerator,
    aiActionBlockedEventGenerator
  );

  it('should render all transcript events in the transcripts array', async () => {
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
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // Every transcript event should appear in the transcripts array
          expect(result.current.transcripts).toHaveLength(events.length);

          events.forEach((event) => {
            const typedEvent = event as any;
            const transcript = result.current.transcripts.find(
              t => t.text === typedEvent.text && 
                   t.speaker === typedEvent.speaker &&
                   t.timestamp === typedEvent.t
            );
            
            expect(transcript).toBeDefined();
            expect(transcript?.text).toBe(typedEvent.text);
            expect(transcript?.speaker).toBe(typedEvent.speaker);
            expect(transcript?.timestamp).toBe(typedEvent.t);
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

  it('should render all ai_reasoning events in the AI activities array', async () => {
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

          // Every ai_reasoning event should appear in the aiActivities array
          const reasoningActivities = result.current.aiActivities.filter(a => a.type === 'reasoning');
          expect(reasoningActivities).toHaveLength(events.length);

          events.forEach((event) => {
            const typedEvent = event as any;
            const activity = reasoningActivities.find(
              a => a.text === typedEvent.text && a.timestamp === typedEvent.t
            );
            
            expect(activity).toBeDefined();
            expect(activity?.type).toBe('reasoning');
            expect(activity?.text).toBe(typedEvent.text);
            expect(activity?.timestamp).toBe(typedEvent.t);
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

  it('should render all ai_action_attempt events in the AI activities array', async () => {
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

          // Every ai_action_attempt event should appear in the aiActivities array
          const attemptActivities = result.current.aiActivities.filter(a => a.type === 'action_attempt');
          expect(attemptActivities).toHaveLength(events.length);

          events.forEach((event) => {
            const typedEvent = event as any;
            const activity = attemptActivities.find(
              a => a.action === typedEvent.action && a.timestamp === typedEvent.t
            );
            
            expect(activity).toBeDefined();
            expect(activity?.type).toBe('action_attempt');
            expect(activity?.action).toBe(typedEvent.action);
            expect(activity?.text).toContain(typedEvent.action);
            expect(activity?.timestamp).toBe(typedEvent.t);
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

  it('should render all ai_action_blocked events in the AI activities array', async () => {
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

          // Every ai_action_blocked event should appear in the aiActivities array
          const blockedActivities = result.current.aiActivities.filter(a => a.type === 'action_blocked');
          expect(blockedActivities).toHaveLength(events.length);

          events.forEach((event) => {
            const typedEvent = event as any;
            const activity = blockedActivities.find(
              a => a.action === typedEvent.action && 
                   a.reason === typedEvent.reason &&
                   a.timestamp === typedEvent.t
            );
            
            expect(activity).toBeDefined();
            expect(activity?.type).toBe('action_blocked');
            expect(activity?.action).toBe(typedEvent.action);
            expect(activity?.reason).toBe(typedEvent.reason);
            expect(activity?.text).toContain(typedEvent.action);
            expect(activity?.timestamp).toBe(typedEvent.t);
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

  it('should render all UI-relevant events in their appropriate UI components', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(uiEventGenerator, { minLength: 5, maxLength: 30 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // Count events by type
          const transcriptEvents = events.filter(e => e.event === 'transcript');
          const aiReasoningEvents = events.filter(e => e.event === 'ai_reasoning');
          const aiActionAttemptEvents = events.filter(e => e.event === 'ai_action_attempt');
          const aiActionBlockedEvents = events.filter(e => e.event === 'ai_action_blocked');

          // Verify all transcript events are rendered
          expect(result.current.transcripts).toHaveLength(transcriptEvents.length);
          transcriptEvents.forEach((event) => {
            const typedEvent = event as any;
            const transcript = result.current.transcripts.find(
              t => t.text === typedEvent.text && t.speaker === typedEvent.speaker
            );
            expect(transcript).toBeDefined();
          });

          // Verify all AI activity events are rendered
          const totalAiActivities = aiReasoningEvents.length + 
                                   aiActionAttemptEvents.length + 
                                   aiActionBlockedEvents.length;
          expect(result.current.aiActivities).toHaveLength(totalAiActivities);

          // Verify reasoning events
          const reasoningActivities = result.current.aiActivities.filter(a => a.type === 'reasoning');
          expect(reasoningActivities).toHaveLength(aiReasoningEvents.length);

          // Verify action attempt events
          const attemptActivities = result.current.aiActivities.filter(a => a.type === 'action_attempt');
          expect(attemptActivities).toHaveLength(aiActionAttemptEvents.length);

          // Verify action blocked events
          const blockedActivities = result.current.aiActivities.filter(a => a.type === 'action_blocked');
          expect(blockedActivities).toHaveLength(aiActionBlockedEvents.length);

          act(() => {
            result.current.reset();
          });
        }
      ),
      { numRuns: 100 }
    );

    vi.useRealTimers();
  });

  it('should preserve event content exactly as provided', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(uiEventGenerator, { minLength: 1, maxLength: 15 }),
        async (events) => {
          const { result } = renderHook(() => useTimeline(events));

          act(() => {
            result.current.play();
          });

          const maxTime = Math.max(...events.map(e => e.t));
          await act(async () => {
            await vi.advanceTimersByTimeAsync(maxTime + 100);
          });

          // For each event, verify its content is preserved exactly
          // We need to match by both timestamp AND content to handle duplicate timestamps
          events.forEach((event) => {
            if (event.event === 'transcript') {
              const typedEvent = event as any;
              const transcript = result.current.transcripts.find(
                t => t.timestamp === typedEvent.t && 
                     t.text === typedEvent.text &&
                     t.speaker === typedEvent.speaker
              );
              expect(transcript).toBeDefined();
              expect(transcript?.text).toBe(typedEvent.text);
              expect(transcript?.speaker).toBe(typedEvent.speaker);
            } else if (event.event === 'ai_reasoning') {
              const typedEvent = event as any;
              const activity = result.current.aiActivities.find(
                a => a.timestamp === typedEvent.t && 
                     a.type === 'reasoning' &&
                     a.text === typedEvent.text
              );
              expect(activity).toBeDefined();
              expect(activity?.text).toBe(typedEvent.text);
            } else if (event.event === 'ai_action_attempt') {
              const typedEvent = event as any;
              const activity = result.current.aiActivities.find(
                a => a.timestamp === typedEvent.t && 
                     a.type === 'action_attempt' &&
                     a.action === typedEvent.action
              );
              expect(activity).toBeDefined();
              expect(activity?.action).toBe(typedEvent.action);
            } else if (event.event === 'ai_action_blocked') {
              const typedEvent = event as any;
              const activity = result.current.aiActivities.find(
                a => a.timestamp === typedEvent.t && 
                     a.type === 'action_blocked' &&
                     a.action === typedEvent.action &&
                     a.reason === typedEvent.reason
              );
              expect(activity).toBeDefined();
              expect(activity?.action).toBe(typedEvent.action);
              expect(activity?.reason).toBe(typedEvent.reason);
            }
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
});
