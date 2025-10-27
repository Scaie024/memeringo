import { Connection } from 'modesl';
import { EventEmitter } from 'events';

class FreeSwitchService extends EventEmitter {
    private connection: Connection | null = null;
    private isConnected = false;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private reconnectDelayMs = 5000;
    private readonly config = {
        host: process.env.FS_ESL_HOST || 'localhost',
        port: parseInt(process.env.FS_ESL_PORT || '8021', 10),
        password: process.env.FS_ESL_PASSWORD || 'ClueCon',
        gateway: process.env.FS_DIAL_GATEWAY || 'my_trunk',
    };

    constructor() {
        super();
    }

    public get connected(): boolean {
        return this.isConnected;
    }

    public get status() {
        return {
            connected: this.isConnected,
            host: this.config.host,
            port: this.config.port,
            gateway: this.config.gateway,
        };
    }

    public async connect(): Promise<void> {
        if (this.isConnected && this.connection) {
            return;
        }

        return new Promise((resolve, reject) => {
            console.error(`Connecting to FreeSWITCH ESL at ${this.config.host}:${this.config.port}...`);
            try {
                const ConnectionCtor = Connection as unknown as any;
                this.connection = new ConnectionCtor(
                    this.config.host,
                    this.config.port,
                    this.config.password,
                    () => {
                        console.error('FreeSWITCH ESL connection ready.');
                        this.isConnected = true;
                        this.clearReconnectTimer();
                        this.reconnectDelayMs = 5000;
                        // @ts-ignore
                        this.emit('connected');
                        resolve();
                    }
                );
            } catch (err) {
                reject(err);
                return;
            }

            const connection = this.connection;
            if (!connection) {
                reject(new Error('Failed to initialize FreeSWITCH connection instance'));
                return;
            }

            connection.on('esl::end', () => {
                console.error('FreeSWITCH ESL connection ended.');
                this.isConnected = false;
                this.scheduleReconnect();
                // @ts-ignore
                this.emit('disconnected');
            });

            connection.on('error', (error: any) => {
                console.error('FreeSWITCH ESL connection error:', error);
                this.isConnected = false;
                this.scheduleReconnect();
                // @ts-ignore
                this.emit('connectionError', error);
                reject(error);
            });
        });
    }

    public disconnect(): void {
        this.clearReconnectTimer();
        if (this.connection) {
            const anyConnection = this.connection as unknown as { disconnect?: () => void; close?: () => void };
            if (typeof anyConnection.disconnect === 'function') {
                anyConnection.disconnect();
            } else if (typeof anyConnection.close === 'function') {
                anyConnection.close();
            }
        }
        this.connection = null;
        this.isConnected = false;
    }

    public async ensureConnected(): Promise<void> {
        if (this.isConnected) {
            return;
        }

        await this.connect();
    }

    public async originateCall(fromNumber: string, destination: string): Promise<string> {
        if (!this.isConnected || !this.connection) {
            throw new Error('Not connected to FreeSWITCH ESL.');
        }

        // Allow local test destinations (extensions in default context)
        // 9000: echo, 9001: tone, 9002: music on hold
        const isLocalTestExt = /^(9000|9001|9002)$/.test(destination);

        // Build dial string depending on the destination
        // - Local test extensions go to internal profile and the default dialplan
        // - Otherwise, use the configured gateway
        const dialString = isLocalTestExt
            ? `sofia/internal/${destination}@127.0.0.1`
            : `sofia/gateway/${this.config.gateway}/${destination}`;

        // For local test extensions the dialplan already plays media (echo/tone/moh), so park the B-leg
        // For gateway calls attach echo to validate media path without remote endpoint
        const app = isLocalTestExt ? 'park()' : 'echo()';

        const command = `originate {origination_caller_id_number=${fromNumber}}${dialString} &${app}`;

        console.error(`Executing originate command: ${command}`);

        return new Promise((resolve, reject) => {
            this.connection!.api(command, (res: any) => {
                const body = res.getBody();
                if (typeof body === 'string' && body.startsWith('+OK')) {
                    const callUuid = body.split(' ')[1]?.trim();
                    console.error(`Call originated successfully. UUID: ${callUuid}`);
                    resolve(callUuid);
                } else {
                    const msg = typeof body === 'string' ? body : JSON.stringify(body);
                    console.error('Failed to originate call:', msg);
                    reject(new Error(`Originate failed: ${msg}`));
                }
            });
        });
    }

    private scheduleReconnect() {
        if (this.reconnectTimer) {
            return;
        }

        const delay = this.reconnectDelayMs;
        console.error(`Reconnecting to FreeSWITCH ESL in ${Math.round(delay / 1000)}s...`);
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.connect().catch((error) => {
                console.error('Reconnection attempt failed:', error);
                this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, 60000);
                this.scheduleReconnect();
            });
        }, delay);
    }

    private clearReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.reconnectDelayMs = 5000;
    }
}

export default FreeSwitchService;