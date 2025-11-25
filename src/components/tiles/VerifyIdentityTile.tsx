import { useState, useEffect } from 'react';
import type { TileProps } from '../../types';

export default function VerifyIdentityTile({ data, onSubmit, status = 'idle' }: TileProps) {
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('');
  const [autoPopulatedFields, setAutoPopulatedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data && typeof data === 'object') {
      try {
        const populated = new Set<string>();
        
        if (data.idType !== undefined && data.idType !== null) {
          setIdType(String(data.idType));
          populated.add('idType');
        }
        if (data.idNumber !== undefined && data.idNumber !== null) {
          setIdNumber(String(data.idNumber));
          populated.add('idNumber');
        }
        if (data.verificationMethod !== undefined && data.verificationMethod !== null) {
          setVerificationMethod(String(data.verificationMethod));
          populated.add('verificationMethod');
        }
        
        setAutoPopulatedFields(populated);
      } catch (error) {
        console.error('Error auto-populating VerifyIdentityTile:', error);
      }
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ idType, idNumber, verificationMethod });
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
        <span className="text-2xl" aria-hidden="true">🔐</span>
        <h3 className="text-xl font-bold text-gray-900">Verify Identity</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">
            ID Type
            {autoPopulatedFields.has('idType') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <select
            id="idType"
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className={getFieldClassName('idType')}
            data-auto-populated={autoPopulatedFields.has('idType')}
            disabled={status === 'submitting' || status === 'completed'}
            aria-describedby={autoPopulatedFields.has('idType') ? 'idType-ai-hint' : undefined}
          >
            <option value="">Select ID Type</option>
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID</option>
            <option value="ssn">Social Security Number</option>
          </select>
          {autoPopulatedFields.has('idType') && (
            <p id="idType-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
            ID Number
            {autoPopulatedFields.has('idNumber') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <input
            id="idNumber"
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className={getFieldClassName('idNumber')}
            data-auto-populated={autoPopulatedFields.has('idNumber')}
            disabled={status === 'submitting' || status === 'completed'}
            aria-describedby={autoPopulatedFields.has('idNumber') ? 'idNumber-ai-hint' : undefined}
          />
          {autoPopulatedFields.has('idNumber') && (
            <p id="idNumber-ai-hint" className="sr-only">This field was auto-populated by AI</p>
          )}
        </div>

        <div>
          <label htmlFor="verificationMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Method
            {autoPopulatedFields.has('verificationMethod') && (
              <span className="ml-2 text-xs text-blue-600 font-semibold" aria-label="AI suggested">✨ AI Suggested</span>
            )}
          </label>
          <select
            id="verificationMethod"
            value={verificationMethod}
            onChange={(e) => setVerificationMethod(e.target.value)}
            className={getFieldClassName('verificationMethod')}
            data-auto-populated={autoPopulatedFields.has('verificationMethod')}
            disabled={status === 'submitting' || status === 'completed'}
            aria-describedby={autoPopulatedFields.has('verificationMethod') ? 'verificationMethod-ai-hint' : undefined}
          >
            <option value="">Select Method</option>
            <option value="document_upload">Document Upload</option>
            <option value="video_call">Video Call</option>
            <option value="knowledge_based">Knowledge-Based Questions</option>
            <option value="biometric">Biometric Verification</option>
          </select>
          {autoPopulatedFields.has('verificationMethod') && (
            <p id="verificationMethod-ai-hint" className="sr-only">This field was auto-populated by AI</p>
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
