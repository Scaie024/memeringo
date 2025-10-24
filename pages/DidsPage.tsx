import React, { useState, useMemo, useEffect } from 'react';
import { DidsToolbar } from '../components/DidsToolbar';
import { DidsDataTable } from '../components/DidsDataTable';
import { AddDidDialog } from '../components/AddDidDialog';
import { Did, CountryCode } from '../types';
import { t } from '../lib/i18n';

export const DidsPage = () => {
  const [dids, setDids] = useState<Did[]>([]);
  const [filter, setFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [callingDidId, setCallingDidId] = useState<string | null>(null);

  const fetchDids = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dids');
      const data = await response.json();
      setDids(data);
    } catch (error) {
      console.error("Failed to fetch DIDs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDids();
  }, []);

  const filteredDids = useMemo(() => {
    if (!filter) return dids;
    return dids.filter(did => did.phoneNumber.includes(filter));
  }, [dids, filter]);

  const handleAddDid = async (phoneNumber: string, country: CountryCode) => {
    try {
      const response = await fetch('/api/dids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, country }),
      });
      if (!response.ok) {
        throw new Error('Failed to add DID');
      }
      // Re-fetch DIDs to show the new one
      await fetchDids();
    } catch (error) {
      console.error("Error adding DID:", error);
    }
  };
  
  const handleCall = async (did: Did) => {
    if (callingDidId) return; // Prevent multiple calls
    setCallingDidId(did.id);
    try {
      const response = await fetch('/api/calls/originate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: did.phoneNumber }),
      });
      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }
      const result = await response.json();
      alert(`Call initiated successfully! Call ID: ${result.callId}`);
    } catch (error) {
        console.error("Error initiating call:", error);
        alert('Failed to initiate call. Check the console for details.');
    } finally {
        setCallingDidId(null);
    }
  };


  return (
    <div className="h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-white">{t.didsPage.title}</h1>
        <p className="mt-2 text-gray-400">{t.didsPage.description}</p>
      </header>
      <div className="mt-6 flex-grow bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col">
        <DidsToolbar
          filter={filter}
          setFilter={setFilter}
          onAddDidClick={() => setIsAddDialogOpen(true)}
        />
        <div className="flex-grow overflow-auto">
          {isLoading ? (
             <div className="flex items-center justify-center h-full text-gray-400">Loading DIDs...</div>
          ) : (
            <DidsDataTable
              dids={filteredDids}
              onCall={handleCall}
              callingDidId={callingDidId}
            />
          )}
        </div>
      </div>
      <AddDidDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddDid={handleAddDid}
      />
    </div>
  );
};
