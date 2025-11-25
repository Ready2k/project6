// Feature: financial-agent-desktop-demo, Property 4: Auto-populate fills form fields
// Validates: Requirements 5.1

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import ChangeAddressTile from '../../src/components/tiles/ChangeAddressTile';
import VerifyIdentityTile from '../../src/components/tiles/VerifyIdentityTile';
import UpdateContactDetailsTile from '../../src/components/tiles/UpdateContactDetailsTile';
import DisputeTransactionTile from '../../src/components/tiles/DisputeTransactionTile';

describe('Property 4: Auto-populate fills form fields', () => {
  const mockOnSubmit = () => {};

  it('ChangeAddressTile: for any auto_populate data, form fields should contain the provided values', () => {
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

          // Check that each provided field has the correct value
          if (data.street !== undefined) {
            const streetInput = container.querySelector('#street') as HTMLInputElement;
            expect(streetInput?.value).toBe(data.street);
          }
          if (data.city !== undefined) {
            const cityInput = container.querySelector('#city') as HTMLInputElement;
            expect(cityInput?.value).toBe(data.city);
          }
          if (data.state !== undefined) {
            const stateInput = container.querySelector('#state') as HTMLInputElement;
            expect(stateInput?.value).toBe(data.state);
          }
          if (data.zip !== undefined) {
            const zipInput = container.querySelector('#zip') as HTMLInputElement;
            expect(zipInput?.value).toBe(data.zip);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('VerifyIdentityTile: for any auto_populate data, form fields should contain the provided values', () => {
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
            expect(idTypeSelect?.value).toBe(data.idType);
          }
          if (data.idNumber !== undefined) {
            const idNumberInput = container.querySelector('#idNumber') as HTMLInputElement;
            expect(idNumberInput?.value).toBe(data.idNumber);
          }
          if (data.verificationMethod !== undefined) {
            const methodSelect = container.querySelector('#verificationMethod') as HTMLSelectElement;
            expect(methodSelect?.value).toBe(data.verificationMethod);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('UpdateContactDetailsTile: for any auto_populate data, form fields should contain the provided values', () => {
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
            expect(phoneInput?.value).toBe(data.phone);
          }
          if (data.email !== undefined) {
            const emailInput = container.querySelector('#email') as HTMLInputElement;
            // Email inputs sanitize values by trimming whitespace (HTML5 spec behavior)
            expect(emailInput?.value).toBe(data.email.trim());
          }
          if (data.preferredContactMethod !== undefined) {
            const methodSelect = container.querySelector('#preferredContactMethod') as HTMLSelectElement;
            expect(methodSelect?.value).toBe(data.preferredContactMethod);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('DisputeTransactionTile: for any auto_populate data, form fields should contain the provided values', () => {
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
            expect(txnInput?.value).toBe(data.transactionId);
          }
          if (data.reason !== undefined) {
            const reasonSelect = container.querySelector('#reason') as HTMLSelectElement;
            expect(reasonSelect?.value).toBe(data.reason);
          }
          if (data.amount !== undefined) {
            const amountInput = container.querySelector('#amount') as HTMLInputElement;
            expect(amountInput?.value).toBe(data.amount.toString());
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
