
import React, { useRef, useEffect } from 'react';
import { TranscriptEntry, Speaker, CallStatus } from '../types';
import { UserIcon, RobotIcon } from './icons/Icons';

interface ConversationViewProps {
  transcript: TranscriptEntry[];
  callStatus: CallStatus;
}

const TranscriptBubble: React.FC<{ entry: TranscriptEntry }> = ({ entry }) => {
  const isAgent = entry.speaker === Speaker.AGENT;
  return (
    <div className={`flex items-start gap-3 w-full max-w-md ${isAgent ? 'self-start' : 'self-end flex-row-reverse'}`}>
        <div className={`p-2 rounded-full ${isAgent ? 'bg-teal-500/20' : 'bg-blue-500/20'}`}>
            {isAgent ? <RobotIcon className="w-6 h-6 text-teal-300" /> : <UserIcon className="w-6 h-6 text-blue-300" />}
        </div>
      <div className={`p-3 rounded-lg ${isAgent ? 'bg-gray-700' : 'bg-blue-600'}`}>
        <p className="text-sm text-white">{entry.text}</p>
      </div>
    </div>
  );
};

export const ConversationView: React.FC<ConversationViewProps> = ({ transcript, callStatus }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);


  return (
    <div className="bg-gray-800/70 p-4 rounded-lg h-80 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">Conversation</h3>
      <div className="flex-grow overflow-y-auto pr-2 flex flex-col gap-4">
        {transcript.length > 0 ? (
          transcript.map((entry, index) => <TranscriptBubble key={index} entry={entry} />)
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            {callStatus === CallStatus.ACTIVE ? 'Listening...' : 'Waiting for call to start...'}
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};
