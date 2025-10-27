/**
 * API Service Layer - Centraliza todas las llamadas a backend
 * Proporciona:
 * - Manejo consistente de errores
 * - Tipos seguros
 * - Logging
 * - Reintentos
 */

import { Did } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

export interface FreeSwitchStatus {
  connected: boolean;
  host: string;
  port: number;
  gateway: string;
}

export class ApiService {
  /**
   * Maneja respuestas HTTP y extrae errores
   */
  private static async handleResponse<T>(response: Response): Promise<T> {
    // Intentar parsear JSON
    let data: any;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // Si response es OK, retornar datos
    if (response.ok) {
      return data;
    }

    // Si NO es OK, lanzar error con contexto
    const error: ApiError = {
      status: response.status,
      message: data?.error || 'Unknown error',
      code: data?.code,
    };

    throw error;
  }

  /**
   * Log de debug
   */
  private static log(method: string, url: string, status?: number, error?: any) {
    const timestamp = new Date().toISOString();
    if (status) {
      console.log(
        `[${timestamp}] ${method.toUpperCase()} ${url} → ${status}`,
        error ? `❌ ${error.message}` : '✅'
      );
    } else {
      console.log(`[${timestamp}] ${method.toUpperCase()} ${url}`);
    }
  }

  /**
   * GET /api/dids - Obtener todos los DIDs
   */
  static async getDids(): Promise<Did[]> {
    const url = `${API_URL}/api/dids`;
    this.log('GET', url);
    try {
      const response = await fetch(url);
      const data = await this.handleResponse<Did[]>(response);
      this.log('GET', url, response.status);
      return data || [];
    } catch (error: any) {
      this.log('GET', url, error.status, error);
      throw error;
    }
  }

  /**
   * POST /api/dids - Crear nuevo DID
   */
  static async createDid(phoneNumber: string, country: string): Promise<Did> {
    const url = `${API_URL}/api/dids`;
    const body = { phoneNumber, country };

    this.log('POST', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await this.handleResponse<Did>(response);
      this.log('POST', url, response.status);
      return data;
    } catch (error: any) {
      this.log('POST', url, error.status, error);
      throw error;
    }
  }

  /**
   * PUT /api/dids/:id - Actualizar DID
   */
  static async updateDid(
    id: string,
    updates: Partial<Did>
  ): Promise<Did> {
    const url = `${API_URL}/api/dids/${id}`;
    this.log('PUT', url);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await this.handleResponse<Did>(response);
      this.log('PUT', url, response.status);
      return data;
    } catch (error: any) {
      this.log('PUT', url, error.status, error);
      throw error;
    }
  }

  /**
   * DELETE /api/dids/:id - Eliminar DID
   */
  static async deleteDid(id: string): Promise<void> {
    const url = `${API_URL}/api/dids/${id}`;
    this.log('DELETE', url);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      await this.handleResponse<{ message: string; id: string }>(response);
      this.log('DELETE', url, response.status);
    } catch (error: any) {
      this.log('DELETE', url, error.status, error);
      throw error;
    }
  }

  /**
   * GET /health - Verificar salud del backend
   */
  static async health(): Promise<{ status: string; timestamp: string }> {
    const url = `${API_URL}/health`;
    this.log('GET', url);

    try {
      const response = await fetch(url);
      const data = await this.handleResponse<{ status: string; timestamp: string }>(response);
      this.log('GET', url, response.status);
      return data;
    } catch (error: any) {
      this.log('GET', url, error.status, error);
      throw error;
    }
  }

  /**
   * GET /api/freeswitch/status - ESL connection state
   */
  static async getFreeSwitchStatus(): Promise<FreeSwitchStatus> {
    const url = `${API_URL}/api/freeswitch/status`;
    this.log('GET', url);

    try {
      const response = await fetch(url);
      const data = await this.handleResponse<FreeSwitchStatus>(response);
      this.log('GET', url, response.status);
      return data;
    } catch (error: any) {
      this.log('GET', url, error.status, error);
      throw error;
    }
  }

  /**
   * POST /api/calls/originate - Initiate outbound call via FreeSWITCH
   */
  static async originateCall(phoneNumber: string, callerId?: string): Promise<{ callId: string }> {
    const url = `${API_URL}/api/calls/originate`;
    const body = { phoneNumber, callerId };
    this.log('POST', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await this.handleResponse<{ callId: string }>(response);
      this.log('POST', url, response.status);
      return data;
    } catch (error: any) {
      this.log('POST', url, error.status, error);
      throw error;
    }
  }
}

/**
 * Formatea mensajes de error para mostrar al usuario
 */
export function formatErrorMessage(error: any): string {
  // Verificar si es un ApiError (tiene status y message)
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    switch (error.status) {
      case 400:
        return `Validación: ${error.message}`;
      case 404:
        return 'No encontrado';
      case 409:
        return `Conflicto: ${error.message}`;
      case 500:
        return 'Error del servidor, intenta de nuevo';
      default:
        return error.message || 'Error desconocido';
    }
  }

  if (error instanceof TypeError) {
    return 'No se pudo conectar al servidor';
  }

  return 'Error desconocido';
}

/**
 * Hook para detectar si es error de conexión
 */
export function isConnectionError(error: any): boolean {
  return error instanceof TypeError || error.status === undefined;
}
