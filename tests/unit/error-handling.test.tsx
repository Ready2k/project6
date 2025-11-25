import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTimeline } from '../../src/hooks/useTimeline';
import DynamicTileContainer from '../../src/components/dynamic/DynamicTileContainer';
import type { TimelineEvent } from '../../src/types/timeline';

describe('Error Handling', () => {
  describe('Timeline Loading Errors', () => {
    it('should handle malformed timeline JSON (non-array)', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Pass a non-array value
      const malformedData = { invalid: 'data' } as any;
      const { result } = renderHook(() => useTimeline(malformedData));
      
      // Should not crash and should have empty state
      expect(result.current.transcripts).toEqual([]);
      expect(result.current.aiActivities).toEqual([]);
      expect(result.current.visiblePanels.size).toBe(0);
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle timeline with invalid events (missing required properties)', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const invalidTimeline: any[] = [
        { t: 0, event: 'transcript' }, // missing text and speaker
        { t: 100, event: 'panel_show' }, // missing panel
        { t: 200, event: 'auto_populate' }, // missing panel and data
      ];
      
      const { result } = renderHook(() => useTimeline(invalidTimeline));
      
      // Start the timeline to trigger event processing
      result.current.play();
      
      // Wait for timeline to process
      await waitFor(() => {
        expect(result.current.currentTime).toBeGreaterThanOrEqual(200);
      }, { timeout: 3000 });
      
      // Should have logged warnings
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      // State should remain empty since all events were invalid
      expect(result.current.transcripts).toEqual([]);
      expect(result.current.visiblePanels.size).toBe(0);
      
      consoleWarnSpy.mockRestore();
    });

    it('should filter out events with invalid structure', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const mixedTimeline: any[] = [
        { t: 0, event: 'transcript', speaker: 'customer', text: 'Valid event' },
        null, // invalid
        { t: 50 }, // missing event type
        { event: 'panel_show', panel: 'test' }, // missing time offset
        'invalid', // not an object
        { t: 100, event: 'ai_reasoning', text: 'Another valid event' },
      ];
      
      const { result } = renderHook(() => useTimeline(mixedTimeline));
      
      // Should have filtered to only valid events
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Event Processing Errors', () => {
    it('should handle unrecognized event types', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const timeline: TimelineEvent[] = [
        { t: 0, event: 'unknown_event_type' } as any,
        { t: 100, event: 'transcript', speaker: 'customer', text: 'Valid' } as any,
      ];
      
      const { result } = renderHook(() => useTimeline(timeline));
      
      // Start the timeline
      result.current.play();
      
      await waitFor(() => {
        expect(result.current.transcripts.length).toBe(1);
      }, { timeout: 3000 });
      
      // Should have warned about unknown event type
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unrecognized event type'),
        expect.anything()
      );
      
      // Valid event should still be processed
      expect(result.current.transcripts).toHaveLength(1);
      expect(result.current.transcripts[0].text).toBe('Valid');
      
      consoleWarnSpy.mockRestore();
    });

    it('should handle events with missing required properties', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const timeline: any[] = [
        { t: 0, event: 'transcript', speaker: 'customer' }, // missing text
        { t: 50, event: 'ai_reasoning' }, // missing text
        { t: 100, event: 'panel_show' }, // missing panel
        { t: 150, event: 'auto_populate', panel: 'test' }, // missing data
      ];
      
      const { result } = renderHook(() => useTimeline(timeline));
      
      result.current.play();
      
      await waitFor(() => {
        expect(result.current.currentTime).toBeGreaterThanOrEqual(150);
      }, { timeout: 3000 });
      
      // Should have warned about missing properties
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      // State should remain empty since all events were invalid
      expect(result.current.transcripts).toEqual([]);
      expect(result.current.aiActivities).toEqual([]);
      expect(result.current.visiblePanels.size).toBe(0);
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Tile Interaction Errors', () => {
    it('should handle missing panel name gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockOnSubmit = vi.fn();
      
      const visiblePanels = new Set(['unknownPanel']);
      
      render(
        <DynamicTileContainer
          visiblePanels={visiblePanels}
          tileData={{}}
          tileStatuses={{}}
          onTileSubmit={mockOnSubmit}
        />
      );
      
      // Should display error message for unknown panel
      expect(screen.getByText('Unknown Panel')).toBeInTheDocument();
      expect(screen.getByText(/Panel "unknownPanel" is not recognized/)).toBeInTheDocument();
      
      // Should have logged warning
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown panel name: unknownPanel')
      );
      
      consoleWarnSpy.mockRestore();
    });

    it('should handle invalid auto_populate data gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockOnSubmit = vi.fn();
      
      const visiblePanels = new Set(['changeAddress']);
      const invalidTileData = {
        changeAddress: null, // invalid data
      };
      
      render(
        <DynamicTileContainer
          visiblePanels={visiblePanels}
          tileData={invalidTileData}
          tileStatuses={{}}
          onTileSubmit={mockOnSubmit}
        />
      );
      
      // Tile should still render (graceful degradation)
      expect(screen.getByText('Change Address')).toBeInTheDocument();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Graceful Degradation', () => {
    it('should handle empty timeline without crashing', () => {
      const { result } = renderHook(() => useTimeline([]));
      
      expect(result.current.transcripts).toEqual([]);
      expect(result.current.aiActivities).toEqual([]);
      expect(result.current.visiblePanels.size).toBe(0);
      expect(result.current.isPlaying).toBe(false);
    });

    it('should handle timeline with only invalid events', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const invalidTimeline: any[] = [
        { t: 0 }, // missing event type
        { event: 'test' }, // missing time
        null,
        undefined,
      ];
      
      const { result } = renderHook(() => useTimeline(invalidTimeline));
      
      // Should not crash
      expect(result.current.transcripts).toEqual([]);
      
      consoleWarnSpy.mockRestore();
    });

    it('should continue processing after encountering an error', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const timeline: any[] = [
        { t: 0, event: 'transcript', speaker: 'customer', text: 'First' },
        { t: 50, event: 'invalid_event' }, // invalid
        { t: 100, event: 'transcript', speaker: 'agent', text: 'Second' },
      ];
      
      const { result } = renderHook(() => useTimeline(timeline));
      
      result.current.play();
      
      await waitFor(() => {
        expect(result.current.transcripts.length).toBe(2);
      }, { timeout: 3000 });
      
      // Both valid events should be processed
      expect(result.current.transcripts[0].text).toBe('First');
      expect(result.current.transcripts[1].text).toBe('Second');
      
      consoleWarnSpy.mockRestore();
    });
  });
});
