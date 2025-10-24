
import React from 'react';
import { SipStatus, CallStatus } from '../types';
import { PhoneIcon, WifiIcon } from './icons/Icons';

interface HeaderProps {
  sipStatus: SipStatus;
  callStatus: CallStatus;
}

const StatusIndicator: React.FC<{ status: string, color: string, children: React.ReactNode }> = ({ status, color, children }) => (
  <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-full text-sm">
    {children}
    <span className={`h-2.5 w-2.5 rounded-full ${color}`}></span>
    <span className="font-medium text-gray-300">{status}</span>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ sipStatus, callStatus }) => {
  const getSipStatus = () => {
    switch (sipStatus) {
      case SipStatus.REGISTERED:
        return { text: 'SIP Registered', color: 'bg-green-500' };
      case SipStatus.CONNECTING:
        return { text: 'Connecting...', color: 'bg-yellow-500 animate-pulse' };
      case SipStatus.ERROR:
        return { text: 'SIP Error', color: 'bg-red-500' };
      default:
        return { text: 'Disconnected', color: 'bg-gray-500' };
    }
  };

  const getCallStatus = () => {
    switch (callStatus) {
      case CallStatus.ACTIVE:
        return { text: 'Call Active', color: 'bg-green-500 animate-pulse' };
      case CallStatus.DIALING:
        return { text: 'Dialing...', color: 'bg-yellow-500' };
      case CallStatus.ENDED:
        return { text: 'Call Ended', color: 'bg-red-500' };
      default:
        return { text: 'Idle', color: 'bg-gray-500' };
    }
  };

  const sip = getSipStatus();
  const call = getCallStatus();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-teal-500 p-2 rounded-lg">
          <PhoneIcon className="h-6 w-6 text-gray-900" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wider">VoiceWoot</h1>
      </div>
      <div className="flex items-center gap-3">
        <StatusIndicator status={sip.text} color={sip.color}>
            <WifiIcon className="h-5 w-5 text-teal-400" />
        </StatusIndicator>
        <StatusIndicator status={call.text} color={call.color}>
            <PhoneIcon className="h-5 w-5 text-teal-400" />
        </StatusIndicator>
      </div>
    </header>
  );
};
