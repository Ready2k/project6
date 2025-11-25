// Feature: financial-agent-desktop-demo, Property 5: Auto-populated fields have visual indicators
// Validates: Requirements 5.2

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import ChangeAddressTile from '../../src/components/tiles/ChangeAddressTile';
import VerifyIdentityTile from '../../src/components/tiles/VerifyIdentityTile';
import UpdateContactDetailsTile from '../../src/components/tiles/UpdateContactDetailsTile';
import DisputeTransactionTile from '../../src/components/tiles/DisputeTransactionTile';

describe('Property 5: Auto-populated fields have visual indicators', () => {
  const mockOnSubmit = () => {};

  it('ChangeAddressTile: for any auto-populated field, the field should have visual indicators', () => {
    fc.assert(
      fc.property(
        fc.record({
          street: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          city: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          state: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          zip: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
        }),
        (data) => {
          const { container } = render(
            <ChangeAddressTile data={data} onSubmit={mockOnSubmit} />
          );

          // Check that auto-populated fields have the data-auto-populated attribute
          if (data.street !== undefined) {
            const streetInput = container.querySelector('#street') as HTMLInputElement;
            expect(streetInput?.getAttribute('data-auto-populated')).toBe('true');
            // Check for visual styling (blue background)
            expect(streetInput?.className).toContain('bg-blue-50');
            expect(streetInput?.className).toContain('border-blue-400');
          }
          if (data.city !== undefined) {
            const cityInput = container.querySelector('#city') as HTMLInputElement;
            expect(cityInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(cityInput?.className).toContain('bg-blue-50');
            expect(cityInput?.className).toContain('border-blue-400');
          }
          if (data.state !== undefined) {
            const stateInput = container.querySelector('#state') as HTMLInputElement;
            expect(stateInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(stateInput?.className).toContain('bg-blue-50');
            expect(stateInput?.className).toContain('border-blue-400');
          }
          if (data.zip !== undefined) {
            const zipInput = container.querySelector('#zip') as HTMLInputElement;
            expect(zipInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(zipInput?.className).toContain('bg-blue-50');
            expect(zipInput?.className).toContain('border-blue-400');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('VerifyIdentityTile: for any auto-populated field, the field should have visual indicators', () => {
    fc.assert(
      fc.property(
        fc.record({
          idType: fc.option(
            fc.constantFrom('passport', 'drivers_license', 'national_id', 'ssn'),
            { nil: undefined }
          ),
          idNumber: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          verificationMethod: fc.option(
            fc.constantFrom('document_upload', 'video_call', 'knowledge_based', 'biometric'),
            { nil: undefined }
          ),
        }),
        (data) => {
          const { container } = render(
            <VerifyIdentityTile data={data} onSubmit={mockOnSubmit} />
          );

          if (data.idType !== undefined) {
            const idTypeSelect = container.querySelector('#idType') as HTMLSelectElement;
            expect(idTypeSelect?.getAttribute('data-auto-populated')).toBe('true');
            expect(idTypeSelect?.className).toContain('bg-blue-50');
            expect(idTypeSelect?.className).toContain('border-blue-400');
          }
          if (data.idNumber !== undefined) {
            const idNumberInput = container.querySelector('#idNumber') as HTMLInputElement;
            expect(idNumberInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(idNumberInput?.className).toContain('bg-blue-50');
            expect(idNumberInput?.className).toContain('border-blue-400');
          }
          if (data.verificationMethod !== undefined) {
            const methodSelect = container.querySelector('#verificationMethod') as HTMLSelectElement;
            expect(methodSelect?.getAttribute('data-auto-populated')).toBe('true');
            expect(methodSelect?.className).toContain('bg-blue-50');
            expect(methodSelect?.className).toContain('border-blue-400');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('UpdateContactDetailsTile: for any auto-populated field, the field should have visual indicators', () => {
    fc.assert(
      fc.property(
        fc.record({
          phone: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          email: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          preferredContactMethod: fc.option(
            fc.constantFrom('phone', 'email', 'sms', 'mail'),
            { nil: undefined }
          ),
        }),
        (data) => {
          const { container } = render(
            <UpdateContactDetailsTile data={data} onSubmit={mockOnSubmit} />
          );

          if (data.phone !== undefined) {
            const phoneInput = container.querySelector('#phone') as HTMLInputElement;
            expect(phoneInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(phoneInput?.className).toContain('bg-blue-50');
            expect(phoneInput?.className).toContain('border-blue-400');
          }
          if (data.email !== undefined) {
            const emailInput = container.querySelector('#email') as HTMLInputElement;
            expect(emailInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(emailInput?.className).toContain('bg-blue-50');
            expect(emailInput?.className).toContain('border-blue-400');
          }
          if (data.preferredContactMethod !== undefined) {
            const methodSelect = container.querySelector('#preferredContactMethod') as HTMLSelectElement;
            expect(methodSelect?.getAttribute('data-auto-populated')).toBe('true');
            expect(methodSelect?.className).toContain('bg-blue-50');
            expect(methodSelect?.className).toContain('border-blue-400');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('DisputeTransactionTile: for any auto-populated field, the field should have visual indicators', () => {
    fc.assert(
      fc.property(
        fc.record({
          transactionId: fc.option(fc.string().filter(s => s.trim().length > 0), { nil: undefined }),
          reason: fc.option(
            fc.constantFrom(
              'unauthorized',
              'duplicate',
              'incorrect_amount',
              'not_received',
              'defective',
              'cancelled',
              'other'
            ),
            { nil: undefined }
          ),
          amount: fc.option(fc.double({ min: 0, max: 100000, noNaN: true }), { nil: undefined }),
        }),
        (data) => {
          const { container } = render(
            <DisputeTransactionTile data={data} onSubmit={mockOnSubmit} />
          );

          if (data.transactionId !== undefined) {
            const txnInput = container.querySelector('#transactionId') as HTMLInputElement;
            expect(txnInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(txnInput?.className).toContain('bg-blue-50');
            expect(txnInput?.className).toContain('border-blue-400');
          }
          if (data.reason !== undefined) {
            const reasonSelect = container.querySelector('#reason') as HTMLSelectElement;
            expect(reasonSelect?.getAttribute('data-auto-populated')).toBe('true');
            expect(reasonSelect?.className).toContain('bg-blue-50');
            expect(reasonSelect?.className).toContain('border-blue-400');
          }
          if (data.amount !== undefined) {
            const amountInput = container.querySelector('#amount') as HTMLInputElement;
            expect(amountInput?.getAttribute('data-auto-populated')).toBe('true');
            expect(amountInput?.className).toContain('bg-blue-50');
            expect(amountInput?.className).toContain('border-blue-400');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
