export type CountryCode = 'MX' | 'US' | 'GB' | 'CO' | 'ES';

export enum DidStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROVISIONING = 'PROVISIONING',
}

export enum DidRouteType {
  AGENT = 'AGENT',
  IVR = 'IVR',
  QUEUE = 'QUEUE',
  N8N_WEBHOOK = 'N8N_WEBHOOK',
}

export interface Did {
  id: string;
  phoneNumber: string;
  country: CountryCode;
  status: DidStatus;
  trunkId: string | null;
  // Updated to match Prisma schema
  routeType: DidRouteType;
  routeTarget: string;
  createdAt: string;
  accountId: string;
}

export enum TrunkStatus {
    REGISTERED = 'REGISTERED',
    UNREGISTERED = 'UNREGISTERED',
    ERROR = 'ERROR',
}

export interface SipTrunk {
    id: string;
    name: string;
    host: string;
    status: TrunkStatus;
    dids: Did[];
    accountId: string;
}

export interface N8nWorkflow {
    id: string;
    name: string;
    n8nWebhookUrl: string;
    n8nWorkflowJson: object;
}

export interface VoiceAgent {
    id: string;
    name: string;
    n8nWorkflow: N8nWorkflow;
    sttProvider: 'whisper';
    ttsProvider: 'piper';
    language: 'es-ES' | 'en-US';
    accountId: string;
}

// FIX: Add missing types for call handling. These were causing import errors.
export enum SipStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  REGISTERED = 'REGISTERED',
  ERROR = 'ERROR',
}

export enum CallStatus {
  IDLE = 'IDLE',
  DIALING = 'DIALING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum Speaker {
  AGENT = 'AGENT',
  USER = 'USER',
}

export interface TranscriptEntry {
  speaker: Speaker;
  text: string;
  timestamp: number;
}

export interface Call {
  id: string;
  phoneNumber: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  transcript: TranscriptEntry[];
}
