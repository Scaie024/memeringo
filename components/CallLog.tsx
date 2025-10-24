
import React from 'react';
import { Call } from '../types';

interface CallLogProps {
  calls: Call[];
}

export const CallLog: React.FC<CallLogProps> = ({ calls }) => {
  const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString();
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-teal-300 mb-4">Call History</h2>
      <div className="flex-grow overflow-y-auto -mr-2 pr-2">
        {calls.length > 0 ? (
          <div className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="bg-gray-700/50 p-4 rounded-lg text-sm">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-white">{call.phoneNumber}</p>
                  <p className="text-gray-400">{formatDuration(call.duration)}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{`Called at ${formatTime(call.startTime)}`}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No recent calls.
          </div>
        )}
      </div>
    </div>
  );
};
