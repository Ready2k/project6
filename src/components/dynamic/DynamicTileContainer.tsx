import ChangeAddressTile from '../tiles/ChangeAddressTile';
import VerifyIdentityTile from '../tiles/VerifyIdentityTile';
import UpdateContactDetailsTile from '../tiles/UpdateContactDetailsTile';
import DisputeTransactionTile from '../tiles/DisputeTransactionTile';

interface DynamicTileContainerProps {
  visiblePanels: Set<string>;
  tileData: Record<string, any>;
  tileStatuses: Record<string, 'idle' | 'submitting' | 'completed'>;
  onTileSubmit: (panelName: string, formData: any) => void;
}

function DynamicTileContainer({
  visiblePanels,
  tileData,
  tileStatuses,
  onTileSubmit,
}: DynamicTileContainerProps) {
  const renderTile = (panelName: string) => {
    const data = tileData[panelName];
    const status = tileStatuses[panelName] || 'idle';
    const handleSubmit = (formData: any) => onTileSubmit(panelName, formData);

    switch (panelName) {
      case 'changeAddress':
        return (
          <ChangeAddressTile
            key={panelName}
            data={data}
            status={status}
            onSubmit={handleSubmit}
          />
        );
      case 'verifyIdentity':
        return (
          <VerifyIdentityTile
            key={panelName}
            data={data}
            status={status}
            onSubmit={handleSubmit}
          />
        );
      case 'updateContactDetails':
        return (
          <UpdateContactDetailsTile
            key={panelName}
            data={data}
            status={status}
            onSubmit={handleSubmit}
          />
        );
      case 'disputeTransaction':
        return (
          <DisputeTransactionTile
            key={panelName}
            data={data}
            status={status}
            onSubmit={handleSubmit}
          />
        );
      default:
        console.warn(`Unknown panel name: ${panelName}`);
        return (
          <div key={panelName} className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-yellow-600 text-2xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-yellow-900">Unknown Panel</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Panel "{panelName}" is not recognized. Please check the timeline configuration.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  const visiblePanelArray = Array.from(visiblePanels);

  return (
    <div className="space-y-5" role="list" aria-label="Active task tiles">
      {visiblePanelArray.length === 0 ? (
        <div className="text-center text-gray-400 py-12 animate-fadeIn">
          <div className="text-5xl mb-3" aria-hidden="true">💼</div>
          <p className="text-base font-medium text-gray-600">No active tasks</p>
          <p className="text-sm text-gray-400 mt-2">
            Tiles will appear here as the AI identifies relevant actions
          </p>
        </div>
      ) : (
        visiblePanelArray.map((panelName) => (
          <div 
            key={panelName} 
            className="animate-slideIn"
            role="listitem"
          >
            {renderTile(panelName)}
          </div>
        ))
      )}
    </div>
  );
}

export default DynamicTileContainer;
