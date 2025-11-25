export default function TelephonyControlsPanel() {
  return (
    <section 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-200"
      aria-labelledby="telephony-controls-heading"
    >
      <h2 id="telephony-controls-heading" className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-teal-100 pb-2 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">📞</span>
        Telephony Controls
      </h2>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors duration-200 shadow-sm"
            disabled
            aria-label="Answer call (disabled)"
          >
            📞 Answer
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors duration-200 shadow-sm"
            disabled
            aria-label="End call (disabled)"
          >
            ❌ End Call
          </button>
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium transition-colors duration-200 shadow-sm"
            disabled
            aria-label="Hold call (disabled)"
          >
            ⏸ Hold
          </button>
          <button 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium transition-colors duration-200 shadow-sm"
            disabled
            aria-label="Transfer call (disabled)"
          >
            ↔️ Transfer
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Call Duration:</span>
            <span className="font-mono font-medium text-gray-900">05:32</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-600">Status:</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
