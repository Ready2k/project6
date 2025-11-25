// Property-Based Tests for Tile Submission Status Updates
// Feature: financial-agent-desktop-demo, Property 6: Tile submission updates status
// Validates: Requirements 5.3, 5.4

import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup, within } from '@testing-library/react';
import * as fc from 'fast-check';
import ChangeAddressTile from '../../src/components/tiles/ChangeAddressTile';
import VerifyIdentityTile from '../../src/components/tiles/VerifyIdentityTile';
import UpdateContactDetailsTile from '../../src/components/tiles/UpdateContactDetailsTile';
import DisputeTransactionTile from '../../src/components/tiles/DisputeTransactionTile';

describe('Property 6: Tile submission updates status', () => {
  afterEach(() => {
    cleanup();
  });

  // Generator for form data
  const changeAddressDataGenerator = fc.record({
    street: fc.string({ minLength: 1, maxLength: 100 }),
    city: fc.string({ minLength: 1, maxLength: 50 }),
    state: fc.string({ minLength: 2, maxLength: 2 }),
    zip: fc.string({ minLength: 5, maxLength: 10 }),
  });

  const verifyIdentityDataGenerator = fc.record({
    idType: fc.constantFrom('passport', 'drivers_license', 'national_id', 'ssn'),
    idNumber: fc.string({ minLength: 5, maxLength: 20 }),
    verificationMethod: fc.constantFrom('document_upload', 'video_call', 'knowledge_based', 'biometric'),
  });

  const updateContactDataGenerator = fc.record({
    phone: fc.string({ minLength: 10, maxLength: 15 }),
    email: fc.emailAddress(),
    preferredContactMethod: fc.constantFrom('phone', 'email', 'sms', 'mail'),
  });

  const disputeTransactionDataGenerator = fc.record({
    transactionId: fc.string({ minLength: 5, maxLength: 20 }),
    reason: fc.constantFrom('unauthorized', 'duplicate', 'incorrect_amount', 'not_received', 'defective', 'cancelled', 'other'),
    amount: fc.float({ min: Math.fround(0.01), max: Math.fround(10000), noNaN: true }),
  });

  it('should transition ChangeAddressTile status from idle to completed after submission', () => {
    fc.assert(
      fc.property(changeAddressDataGenerator, (formData) => {
        let submittedData: any = null;
        const handleSubmit = (data: any) => {
          submittedData = data;
        };

        const { container, rerender } = render(
          <ChangeAddressTile onSubmit={handleSubmit} status="idle" />
        );

        const tile = within(container);

        // Fill in the form fields
        const streetInput = tile.getByLabelText(/street address/i) as HTMLInputElement;
        const cityInput = tile.getByLabelText(/city/i) as HTMLInputElement;
        const stateInput = tile.getByLabelText(/state/i) as HTMLInputElement;
        const zipInput = tile.getByLabelText(/zip code/i) as HTMLInputElement;

        fireEvent.change(streetInput, { target: { value: formData.street } });
        fireEvent.change(cityInput, { target: { value: formData.city } });
        fireEvent.change(stateInput, { target: { value: formData.state } });
        fireEvent.change(zipInput, { target: { value: formData.zip } });

        // Verify initial status is idle (button should say "Submit")
        const submitButton = tile.getByRole('button', { name: /submit/i });
        expect(submitButton).toHaveTextContent('Submit');
        expect(submitButton).not.toBeDisabled();

        // Submit the form
        fireEvent.click(submitButton);

        // Verify onSubmit was called
        expect(submittedData).not.toBeNull();

        // Rerender with completed status
        rerender(<ChangeAddressTile onSubmit={handleSubmit} status="completed" />);

        // Verify status is now completed
        const completedButton = tile.getByRole('button', { name: /submitted/i });
        expect(completedButton).toHaveTextContent('Submitted');
        expect(completedButton).toBeDisabled();

        // Verify completion indicator is visible
        expect(tile.getByText(/completed/i)).toBeInTheDocument();
        
        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it('should transition VerifyIdentityTile status from idle to completed after submission', () => {
    fc.assert(
      fc.property(verifyIdentityDataGenerator, (formData) => {
        let submittedData: any = null;
        const handleSubmit = (data: any) => {
          submittedData = data;
        };

        const { container, rerender } = render(
          <VerifyIdentityTile onSubmit={handleSubmit} status="idle" />
        );

        const tile = within(container);

        // Fill in the form fields
        const idTypeSelect = tile.getByLabelText(/id type/i) as HTMLSelectElement;
        const idNumberInput = tile.getByLabelText(/id number/i) as HTMLInputElement;
        const verificationMethodSelect = tile.getByLabelText(/verification method/i) as HTMLSelectElement;

        fireEvent.change(idTypeSelect, { target: { value: formData.idType } });
        fireEvent.change(idNumberInput, { target: { value: formData.idNumber } });
        fireEvent.change(verificationMethodSelect, { target: { value: formData.verificationMethod } });

        // Verify initial status is idle
        const submitButton = tile.getByRole('button', { name: /submit/i });
        expect(submitButton).toHaveTextContent('Submit');
        expect(submitButton).not.toBeDisabled();

        // Submit the form
        fireEvent.click(submitButton);

        // Verify onSubmit was called
        expect(submittedData).not.toBeNull();

        // Rerender with completed status
        rerender(<VerifyIdentityTile onSubmit={handleSubmit} status="completed" />);

        // Verify status is now completed
        const completedButton = tile.getByRole('button', { name: /submitted/i });
        expect(completedButton).toHaveTextContent('Submitted');
        expect(completedButton).toBeDisabled();

        // Verify completion indicator is visible
        expect(tile.getByText(/completed/i)).toBeInTheDocument();
        
        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it('should transition UpdateContactDetailsTile status from idle to completed after submission', () => {
    fc.assert(
      fc.property(updateContactDataGenerator, (formData) => {
        let submittedData: any = null;
        const handleSubmit = (data: any) => {
          submittedData = data;
        };

        const { container, rerender } = render(
          <UpdateContactDetailsTile onSubmit={handleSubmit} status="idle" />
        );

        const tile = within(container);

        // Fill in the form fields
        const phoneInput = tile.getByLabelText(/phone number/i) as HTMLInputElement;
        const emailInput = tile.getByLabelText(/email address/i) as HTMLInputElement;
        const preferredMethodSelect = tile.getByLabelText(/preferred contact method/i) as HTMLSelectElement;

        fireEvent.change(phoneInput, { target: { value: formData.phone } });
        fireEvent.change(emailInput, { target: { value: formData.email } });
        fireEvent.change(preferredMethodSelect, { target: { value: formData.preferredContactMethod } });

        // Verify initial status is idle
        const submitButton = tile.getByRole('button', { name: /submit/i });
        expect(submitButton).toHaveTextContent('Submit');
        expect(submitButton).not.toBeDisabled();

        // Submit the form
        fireEvent.click(submitButton);

        // Verify onSubmit was called
        expect(submittedData).not.toBeNull();

        // Rerender with completed status
        rerender(<UpdateContactDetailsTile onSubmit={handleSubmit} status="completed" />);

        // Verify status is now completed
        const completedButton = tile.getByRole('button', { name: /submitted/i });
        expect(completedButton).toHaveTextContent('Submitted');
        expect(completedButton).toBeDisabled();

        // Verify completion indicator is visible
        expect(tile.getByText(/completed/i)).toBeInTheDocument();
        
        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it('should transition DisputeTransactionTile status from idle to completed after submission', () => {
    fc.assert(
      fc.property(disputeTransactionDataGenerator, (formData) => {
        let submittedData: any = null;
        const handleSubmit = (data: any) => {
          submittedData = data;
        };

        const { container, rerender } = render(
          <DisputeTransactionTile onSubmit={handleSubmit} status="idle" />
        );

        const tile = within(container);

        // Fill in the form fields
        const transactionIdInput = tile.getByLabelText(/transaction id/i) as HTMLInputElement;
        const reasonSelect = tile.getByLabelText(/dispute reason/i) as HTMLSelectElement;
        const amountInput = tile.getByLabelText(/disputed amount/i) as HTMLInputElement;

        fireEvent.change(transactionIdInput, { target: { value: formData.transactionId } });
        fireEvent.change(reasonSelect, { target: { value: formData.reason } });
        fireEvent.change(amountInput, { target: { value: formData.amount.toString() } });

        // Verify initial status is idle
        const submitButton = tile.getByRole('button', { name: /submit/i });
        expect(submitButton).toHaveTextContent('Submit');
        expect(submitButton).not.toBeDisabled();

        // Submit the form - use fireEvent.submit on the form element to bypass HTML5 validation
        const form = container.querySelector('form');
        if (form) {
          fireEvent.submit(form);
        }

        // Verify onSubmit was called
        expect(submittedData).not.toBeNull();

        // Rerender with completed status
        rerender(<DisputeTransactionTile onSubmit={handleSubmit} status="completed" />);

        // Verify status is now completed
        const completedButton = tile.getByRole('button', { name: /submitted/i });
        expect(completedButton).toHaveTextContent('Submitted');
        expect(completedButton).toBeDisabled();

        // Verify completion indicator is visible
        expect(tile.getByText(/completed/i)).toBeInTheDocument();
        
        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it('should keep tiles disabled when status is completed', () => {
    fc.assert(
      fc.property(changeAddressDataGenerator, (formData) => {
        const handleSubmit = () => {};

        const { container } = render(
          <ChangeAddressTile 
            onSubmit={handleSubmit} 
            status="completed" 
            data={formData}
          />
        );

        const tile = within(container);

        // All form fields should be disabled
        const streetInput = tile.getByLabelText(/street address/i) as HTMLInputElement;
        const cityInput = tile.getByLabelText(/city/i) as HTMLInputElement;
        const stateInput = tile.getByLabelText(/state/i) as HTMLInputElement;
        const zipInput = tile.getByLabelText(/zip code/i) as HTMLInputElement;
        const submitButton = tile.getByRole('button', { name: /submitted/i });

        expect(streetInput).toBeDisabled();
        expect(cityInput).toBeDisabled();
        expect(stateInput).toBeDisabled();
        expect(zipInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
        
        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
