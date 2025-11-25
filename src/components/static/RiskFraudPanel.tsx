import type { RiskIndicator } from '../../types/models';

interface RiskFraudPanelProps {
  riskIndicators: RiskIndicator[];
}

export default function RiskFraudPanel({ riskIndicators }: RiskFraudPanelProps) {
  const getLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <section 
      className="bg-white rounded-lg shadow-md p-4 border-2 border-gray-200 hover:shadow-lg transition-shadow duration-200"
      aria-labelledby="risk-fraud-heading"
    >
      <h2 id="risk-fraud-heading" className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-red-100 pb-2 flex items-center gap-2">
        <span className="text-xl" aria-hidden="true">🚨</span>
        Risk & Fraud Indicators
      </h2>
      <div className="space-y-3">
        {riskIndicators.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No risk indicators detected</p>
        ) : (
          riskIndicators.map((indicator, index) => (
            <div key={index} className="border border-gray-200 rounded p-3">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">{indicator.type}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium uppercase ${getLevelColor(indicator.level)}`}>
                  {indicator.level}
                </span>
              </div>
              <p className="text-xs text-gray-600">{indicator.description}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
