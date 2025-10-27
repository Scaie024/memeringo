import React, { useState, useMemo, useEffect } from 'react';
import { DidsToolbar } from '../components/DidsToolbar';
import { DidsDataTable } from '../components/DidsDataTable';
import { AddDidDialog } from '../components/AddDidDialog';
import { Did, CountryCode } from '../types';
import { t } from '../lib/i18n';
import { ApiService, FreeSwitchStatus, formatErrorMessage } from '../lib/api';

export const DidsPage = () => {
  const [dids, setDids] = useState<Did[]>([]);
  const [filter, setFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callingDidId, setCallingDidId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [freeSwitchStatus, setFreeSwitchStatus] = useState<FreeSwitchStatus | null>(null);
  const [isFsStatusLoading, setIsFsStatusLoading] = useState(true);

  const fetchDids = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await ApiService.getDids();
      setDids(data);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error("Failed to fetch DIDs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDids();
  }, []);

  const loadFreeSwitchStatus = async () => {
    setIsFsStatusLoading(true);
    try {
      const status = await ApiService.getFreeSwitchStatus();
      setFreeSwitchStatus(status);
    } catch (err) {
      console.error('Unable to load FreeSWITCH status:', err);
      setFreeSwitchStatus(null);
    } finally {
      setIsFsStatusLoading(false);
    }
  };

  useEffect(() => {
    loadFreeSwitchStatus();
    const interval = setInterval(loadFreeSwitchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredDids = useMemo(() => {
    if (!filter) return dids;
    return dids.filter(did => did.phoneNumber.includes(filter));
  }, [dids, filter]);

  const handleAddDid = async (phoneNumber: string, country: CountryCode) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await ApiService.createDid(phoneNumber, country);
      // Re-fetch DIDs to show the new one
      await fetchDids();
      setSuccessMessage('DID creado correctamente.');
      setIsAddDialogOpen(false);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error("Error adding DID:", err);
    }
  };
  const handleCall = async (did: Did) => {
    if (callingDidId) return; // Prevent multiple calls
    setCallingDidId(did.id);
    try {
      setError(null);
      setSuccessMessage(null);
      const { callId } = await ApiService.originateCall(did.phoneNumber);
      setSuccessMessage(`Llamada iniciada correctamente. Call ID: ${callId}`);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error("Error initiating call:", err);
    } finally {
      setCallingDidId(null);
    }
  };

  const handleDeleteDid = async (didId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este DID?')) return;

    try {
      setError(null);
      setSuccessMessage(null);
      await ApiService.deleteDid(didId);
      // Refresca la lista
      await fetchDids();
      setSuccessMessage('DID eliminado correctamente.');
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error("Error deleting DID:", err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-white">{t.didsPage.title}</h1>
        <p className="mt-2 text-gray-400">{t.didsPage.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="rounded-md border border-gray-700/50 bg-gray-800/50 px-4 py-2 text-sm text-gray-300">
            <span className="font-semibold text-gray-100">FreeSWITCH:</span>{' '}
            {isFsStatusLoading ? 'Comprobando...' : freeSwitchStatus?.connected ? 'Conectado' : 'Desconectado'}
            {freeSwitchStatus && (
              <span className="ml-2 text-gray-400">
                {freeSwitchStatus.host}:{freeSwitchStatus.port} · Gateway {freeSwitchStatus.gateway}
              </span>
            )}
          </div>
        </div>
      </header>
      
      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex justify-between items-center">
          <span className="text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-500/50 rounded-lg flex justify-between items-center">
          <span className="text-emerald-400">{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-300"
          >
            ✕
          </button>
        </div>
      )}

      <div className="mt-6 flex-grow bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col">
        <DidsToolbar
          filter={filter}
          setFilter={setFilter}
          onAddDidClick={() => setIsAddDialogOpen(true)}
        />
        <div className="flex-grow overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Loading DIDs...
            </div>
          ) : (
            <DidsDataTable
              dids={filteredDids}
              onCall={handleCall}
              onDelete={handleDeleteDid}
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
