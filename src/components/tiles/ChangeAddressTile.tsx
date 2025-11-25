import { useState, useEffect } from 'react';
import type { TileProps } from '../../types';

export default function ChangeAddressTile({ data, onSubmit, status = 'idle' }: TileProps) {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [autoPopulatedFields, setAutoPopulatedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data && typeof data === 'object') {
      try {
        const populated = new Set<string>();
        
        // Safely populate fields, converting to string if needed
        if (data.street !== undefined && data.street !== null) {
          setStreet(String(data.street));
          populated.add('street');
        }
        if (data.city !== undefined && data.city !== null) {
          setCity(String(data.city));
          populated.add('city');
        }
        if (data.state !== undefined && data.state !== null) {
          setState(String(data.state));
          populated.add('state');
        }
        if (data.zip !== undefined && data.zip !== null) {
          setZip(String(data.zip));
          populated.add('zip');
        }
        
        setAutoPopulatedFields(populated);
      } catch (error) {
        console.error('Error auto-populating ChangeAddressTile:', error);
      }
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ street, city, state, zip });
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
        <span className="text-2xl" aria-hidden="true">🏠</span>
        <h3 className="text-xl font-bold text-gray-900">Change Address</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
            {autoPopulatedFields.has('street') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">
                ✨ AI Suggested
              </span>
            )}
          </label>
          <input
            id="street"
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className={getFieldClassName('street')}
            data-auto-populated={autoPopulatedFields.has('street')}
            disabled={status === 'submitting' || status === 'completed'}
            aria-describedby={autoPopulatedFields.has('street') ? 'street-ai-hint' : undefined}
          />
          {autoPopulatedFields.has('street') && (
            <p id="street-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
            {autoPopulatedFields.has('city') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">
                ✨ AI Suggested
              </span>
            )}
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={getFieldClassName('city')}
            data-auto-populated={autoPopulatedFields.has('city')}
            disabled={status === 'submitting' || status === 'completed'}
            aria-describedby={autoPopulatedFields.has('city') ? 'city-ai-hint' : undefined}
          />
          {autoPopulatedFields.has('city') && (
            <p id="city-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
              {autoPopulatedFields.has('state') && (
                <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">
                  ✨ AI Suggested
                </span>
              )}
            </label>
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={getFieldClassName('state')}
              data-auto-populated={autoPopulatedFields.has('state')}
              disabled={status === 'submitting' || status === 'completed'}
              aria-describedby={autoPopulatedFields.has('state') ? 'state-ai-hint' : undefined}
            />
            {autoPopulatedFields.has('state') && (
              <p id="state-ai-hint" className="sr-only">This field was auto-populated by AI</p>
            )}
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
              {autoPopulatedFields.has('zip') && (
                <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">
                  ✨ AI Suggested
                </span>
              )}
            </label>
            <input
              id="zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className={getFieldClassName('zip')}
              data-auto-populated={autoPopulatedFields.has('zip')}
              disabled={status === 'submitting' || status === 'completed'}
              aria-describedby={autoPopulatedFields.has('zip') ? 'zip-ai-hint' : undefined}
            />
            {autoPopulatedFields.has('zip') && (
              <p id="zip-ai-hint" className="sr-only">This field was auto-populated by AI</p>
            )}
          </div>
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
