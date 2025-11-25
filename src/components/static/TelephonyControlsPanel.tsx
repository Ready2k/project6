export default function TelephonyControlsPanel() {
  return (
    <section 
      className="p-4 border-b border-gray-200"
      aria-labelledby="telephony-controls-heading"
    >
      <h3 id="telephony-controls-heading" className="text-sm font-semibold text-gray-700 mb-3">Call Controls</h3>
      <div className="grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">
          End Call
        </button>
        <button className="px-3 py-2 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700">
          Hold
        </button>
        <button className="px-3 py-2 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700">
          Mute
        </button>
        <button className="px-3 py-2 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700">
          Transfer
        </button>
      </div>
      <div className="mt-3 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Duration:</span>
          <span className="font-mono font-semibold">05:32</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-500">Status:</span>
          <span className="text-green-600 font-medium">Active</span>
        </div>
      </div>
    </section>
  );
}
