import type { Interaction } from '../../types/models';

interface PreviousInteractionsPanelProps {
  interactions: Interaction[];
}

export default function PreviousInteractionsPanel({ interactions }: PreviousInteractionsPanelProps) {
  return (
    <section 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-200"
      aria-labelledby="previous-interactions-heading"
    >
      <h2 id="previous-interactions-heading" className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-indigo-100 pb-2 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">📝</span>
        Previous Interactions
      </h2>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {interactions.map((interaction) => (
          <div key={interaction.id} className="border border-gray-200 rounded p-3">
            <div className="flex justify-between items-start mb-1">
              <p className="text-sm font-medium text-gray-900">{interaction.channel}</p>
              <span className="text-xs text-gray-500">{interaction.date}</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{interaction.summary}</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Agent: {interaction.agent}</span>
              <span>Duration: {interaction.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
