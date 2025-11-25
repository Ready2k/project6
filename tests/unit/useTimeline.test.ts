// Unit tests for useTimeline hook
// Requirements: 4.5, 7.8

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTimeline } from '../../src/hooks/useTimeline';
import type { TimelineEvent } from '../../src/types/timeline';

describe('useTimeline', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useTimeline([]));

    expect(result.current.transcripts).toEqual([]);
    expect(result.current.aiActivities).toEqual([]);
    expect(result.current.visiblePanels.size).toBe(0);
    expect(result.current.tileData).toEqual({});
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);
  });

  it('should sort events by time offset', async () => {
    const events: TimelineEvent[] = [
      { t: 100, event: 'transcript', speaker: 'customer', text: 'Third' },
      { t: 0, event: 'transcript', speaker: 'customer', text: 'First' },
      { t: 50, event: 'transcript', speaker: 'agent', text: 'Second' },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    // First event at t=0 should process immediately
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.transcripts).toHaveLength(1);
    expect(result.current.transcripts[0].text).toBe('First');

    // Second event at t=50 (50ms after first)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(result.current.transcripts).toHaveLength(2);
    expect(result.current.transcripts[1].text).toBe('Second');

    // Third event at t=100 (50ms after second)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(50);
    });
    expect(result.current.transcripts).toHaveLength(3);
    expect(result.current.transcripts[2].text).toBe('Third');

    vi.useRealTimers();
  });

  it('should process transcript events', async () => {
    const events: TimelineEvent[] = [
      { t: 0, event: 'transcript', speaker: 'customer', text: 'Hello' },
      { t: 10, event: 'transcript', speaker: 'agent', text: 'Hi there' },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.transcripts).toHaveLength(1);
    expect(result.current.transcripts[0]).toEqual({
      speaker: 'customer',
      text: 'Hello',
      timestamp: 0,
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(result.current.transcripts).toHaveLength(2);
    expect(result.current.transcripts[1]).toEqual({
      speaker: 'agent',
      text: 'Hi there',
      timestamp: 10,
    });

    vi.useRealTimers();
  });

  it('should process ai_reasoning events', async () => {
    const events: TimelineEvent[] = [
      { t: 0, event: 'ai_reasoning', text: 'Customer wants to change address' },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.aiActivities).toHaveLength(1);
    expect(result.current.aiActivities[0]).toEqual({
      type: 'reasoning',
      text: 'Customer wants to change address',
      timestamp: 0,
    });

    vi.useRealTimers();
  });

  it('should process panel_show and panel_hide events', async () => {
    const events: TimelineEvent[] = [
      { t: 0, event: 'panel_show', panel: 'changeAddress' },
      { t: 10, event: 'panel_show', panel: 'verifyIdentity' },
      { t: 20, event: 'panel_hide', panel: 'changeAddress' },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.visiblePanels.has('changeAddress')).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(result.current.visiblePanels.has('verifyIdentity')).toBe(true);
    expect(result.current.visiblePanels.size).toBe(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(result.current.visiblePanels.has('changeAddress')).toBe(false);
    expect(result.current.visiblePanels.has('verifyIdentity')).toBe(true);
    expect(result.current.visiblePanels.size).toBe(1);

    vi.useRealTimers();
  });

  it('should process auto_populate events', async () => {
    const events: TimelineEvent[] = [
      {
        t: 0,
        event: 'auto_populate',
        panel: 'changeAddress',
        data: { street: '123 Main St', city: 'London' },
      },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(result.current.tileData.changeAddress).toEqual({
      street: '123 Main St',
      city: 'London',
    });

    vi.useRealTimers();
  });

  it('should support pause and resume', async () => {
    const events: TimelineEvent[] = [
      { t: 0, event: 'transcript', speaker: 'customer', text: 'First' },
      { t: 100, event: 'transcript', speaker: 'customer', text: 'Second' },
      { t: 200, event: 'transcript', speaker: 'customer', text: 'Third' },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.transcripts).toHaveLength(1);
    expect(result.current.isPlaying).toBe(true);

    // Pause after first event
    act(() => {
      result.current.pause();
    });
    expect(result.current.isPlaying).toBe(false);

    // Advance time while paused - no new events should process
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(result.current.transcripts).toHaveLength(1);

    // Resume
    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(result.current.transcripts).toHaveLength(2);

    vi.useRealTimers();
  });

  it('should support reset', async () => {
    const events: TimelineEvent[] = [
      { t: 0, event: 'transcript', speaker: 'customer', text: 'Hello' },
      { t: 10, event: 'panel_show', panel: 'changeAddress' },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(result.current.transcripts).toHaveLength(1);
    expect(result.current.visiblePanels.size).toBe(1);

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.transcripts).toEqual([]);
    expect(result.current.aiActivities).toEqual([]);
    expect(result.current.visiblePanels.size).toBe(0);
    expect(result.current.tileData).toEqual({});
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTime).toBe(0);

    vi.useRealTimers();
  });

  it('should handle all event types without errors', async () => {
    const events: TimelineEvent[] = [
      { t: 0, event: 'transcript', speaker: 'customer', text: 'Hello' },
      { t: 10, event: 'ai_reasoning', text: 'Processing request' },
      { t: 20, event: 'ai_action_attempt', action: 'show_form' },
      { t: 30, event: 'ai_action_blocked', action: 'delete_account', reason: 'Insufficient permissions' },
      { t: 40, event: 'panel_show', panel: 'changeAddress' },
      { t: 50, event: 'auto_populate', panel: 'changeAddress', data: { city: 'London' } },
      { t: 60, event: 'panel_hide', panel: 'changeAddress' },
    ];

    const { result } = renderHook(() => useTimeline(events));

    act(() => {
      result.current.play();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60);
    });

    expect(result.current.transcripts).toHaveLength(1);
    expect(result.current.aiActivities).toHaveLength(3);
    expect(result.current.visiblePanels.size).toBe(0); // shown then hidden
    expect(result.current.tileData.changeAddress).toBeDefined();

    vi.useRealTimers();
  });
});
