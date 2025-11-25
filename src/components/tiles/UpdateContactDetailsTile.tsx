import { useState, useEffect } from 'react';
import type { TileProps } from '../../types';

export default function UpdateContactDetailsTile({ data, onSubmit, status = 'idle' }: TileProps) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('');
  const [autoPopulatedFields, setAutoPopulatedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data && typeof data === 'object') {
      try {
        const populated = new Set<string>();
        
        if (data.phone !== undefined && data.phone !== null) {
          setPhone(String(data.phone));
          populated.add('phone');
        }
        if (data.email !== undefined && data.email !== null) {
          setEmail(String(data.email));
          populated.add('email');
        }
        if (data.preferredContactMethod !== undefined && data.preferredContactMethod !== null) {
          setPreferredContactMethod(String(data.preferredContactMethod));
          populated.add('preferredContactMethod');
        }
        
        setAutoPopulatedFields(populated);
      } catch (error) {
        console.error('Error auto-populating UpdateContactDetailsTile:', error);
      }
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ phone, email, preferredContactMethod });
  };

  const getFieldClassName = (fieldName: string) => {
    const baseClass = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200';
    return autoPopulatedFields.has(fieldName)
      ? `${baseClass} bg-blue-50 border-blue-400 border-2 shadow-sm`
      : `${baseClass} border-gray-300`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-2xl" aria-hidden="true">📞</span>
        <h3 className="text-xl font-bold text-gray-900">Update Contact Details</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
            {autoPopulatedFields.has('phone') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={getFieldClassName('phone')}
            data-auto-populated={autoPopulatedFields.has('phone')}
            disabled={status === 'submitting' || status === 'completed'}
            placeholder="(555) 123-4567"
            aria-describedby={autoPopulatedFields.has('phone') ? 'phone-ai-hint' : undefined}
          />
          {autoPopulatedFields.has('phone') && (
            <p id="phone-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
            {autoPopulatedFields.has('email') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={getFieldClassName('email')}
            data-auto-populated={autoPopulatedFields.has('email')}
            disabled={status === 'submitting' || status === 'completed'}
            placeholder="email@example.com"
            aria-describedby={autoPopulatedFields.has('email') ? 'email-ai-hint' : undefined}
          />
          {autoPopulatedFields.has('email') && (
            <p id="email-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div>
          <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Contact Method
            {autoPopulatedFields.has('preferredContactMethod') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <select
            id="preferredContactMethod"
            value={preferredContactMethod}
            onChange={(e) => setPreferredContactMethod(e.target.value)}
            className={getFieldClassName('preferredContactMethod')}
            data-auto-populated={autoPopulatedFields.has('preferredContactMethod')}
            disabled={status === 'submitting' || status === 'completed'}
            aria-describedby={autoPopulatedFields.has('preferredContactMethod') ? 'preferredContactMethod-ai-hint' : undefined}
          >
            <option value="">Select Method</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="mail">Mail</option>
          </select>
          {autoPopulatedFields.has('preferredContactMethod') && (
            <p id="preferredContactMethod-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <button
            type="submit"
            disabled={status === 'submitting' || status === 'completed'}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
              status === 'completed'
                ? 'bg-green-500 text-white cursor-not-allowed'
                : status === 'submitting'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
            aria-label={status === 'completed' ? 'Form submitted' : status === 'submitting' ? 'Submitting form' : 'Submit form'}
          >
            {status === 'completed' ? '✓ Submitted' : status === 'submitting' ? '⏳ Submitting...' : 'Submit'}
          </button>

          {status === 'completed' && (
            <span className="text-green-600 font-semibold flex items-center gap-1 animate-fadeIn" role="status">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Completed
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
