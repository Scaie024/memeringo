
import React, { useState } from 'react';
import { CallStatus, SipStatus } from '../types';
import { PhoneIcon, HangUpIcon } from './icons/Icons';

interface DialerProps {
  callStatus: CallStatus;
  sipStatus: SipStatus;
  onStartCall: (phoneNumber: string) => void;
  onEndCall: () => void;
}

export const Dialer: React.FC<DialerProps> = ({ callStatus, sipStatus, onStartCall, onEndCall }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCallClick = () => {
    if (phoneNumber.trim()) {
      onStartCall(phoneNumber);
    }
  };

  const isCalling = callStatus === CallStatus.ACTIVE || callStatus === CallStatus.DIALING;
  const canCall = sipStatus === SipStatus.REGISTERED && callStatus === CallStatus.IDLE;

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg h-full justify-center">
      <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-400">
        Enter Phone Number
      </label>
      <input
        id="phoneNumber"
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+52 55 1234 5678"
        disabled={isCalling}
        className="bg-gray-700 border border-gray-600 text-white text-lg rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition"
      />
      {isCalling ? (
        <button
          onClick={onEndCall}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-transform transform hover:scale-105"
        >
          <HangUpIcon className="w-6 h-6" />
          Hang Up
        </button>
      ) : (
        <button
          onClick={handleCallClick}
          disabled={!canCall || !phoneNumber}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-center text-white rounded-lg transition-transform transform hover:scale-105 ${
            canCall && phoneNumber
              ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300'
              : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          <PhoneIcon className="w-6 h-6" />
          Call
        </button>
      )}
    </div>
  );
};
