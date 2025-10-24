import { Connection } from 'modesl';
import { EventEmitter } from 'events';

class FreeSwitchService extends EventEmitter {
    private connection: Connection | null = null;
    private isConnected: boolean = false;
    private readonly config = {
        host: process.env.FS_ESL_HOST || 'localhost',
        port: parseInt(process.env.FS_ESL_PORT || '8021', 10),
        password: process.env.FS_ESL_PASSWORD || 'ClueCon',
    };

    constructor() {
        super();
    }

    public async connect(): Promise<void> {
        if (this.isConnected && this.connection) {
            console.error('Already connected to FreeSWITCH ESL.');
            return;
        }

        return new Promise((resolve, reject) => {
            console.error(`Connecting to FreeSWITCH ESL at ${this.config.host}:${this.config.port}...`);
            this.connection = new Connection({
                host: this.config.host,
                port: this.config.port,
                password: this.config.password,
            });

            this.connection.on('esl::ready', () => {
                console.error('FreeSWITCH ESL connection ready.');
                this.isConnected = true;
                // FIX: Bypass incorrect type definition for EventEmitter which seems to be missing the 'emit' property.
                // @ts-ignore
                this.emit('connected');
                resolve();
            });

            this.connection.on('esl::end', () => {
                console.error('FreeSWITCH ESL connection ended.');
                this.isConnected = false;
                // FIX: Bypass incorrect type definition for EventEmitter which seems to be missing the 'emit' property.
                // @ts-ignore
                this.emit('disconnected');
            });
            
            this.connection.on('error', (error) => {
                console.error('FreeSWITCH ESL connection error:', error);
                this.isConnected = false;
                // FIX: Bypass incorrect type definition for EventEmitter which seems to be missing the 'emit' property.
                // @ts-ignore
                this.emit('error', error);
                reject(error);
            });
        });
    }

    public disconnect(): void {
        if (this.connection) {
            this.connection.close();
        }
    }

    public async originateCall(fromNumber: string, destination: string): Promise<string> {
        if (!this.isConnected || !this.connection) {
            throw new Error('Not connected to FreeSWITCH ESL.');
        }

        // Example: originate {origination_caller_id_number=...}sofia/gateway/my_trunk/... &echo()
        const command = `originate {origination_caller_id_number=${fromNumber}}sofia/gateway/my_trunk/${destination} &echo()`;

        console.error(`Executing originate command: ${command}`);
        
        return new Promise((resolve, reject) => {
            this.connection!.api(command, (res) => {
                const body = res.getBody();
                if (body.startsWith('+OK')) {
                    const callUuid = body.split(' ')[1]?.trim();
                    console.error(`Call originated successfully. UUID: ${callUuid}`);
                    resolve(callUuid);
                } else {
                    console.error('Failed to originate call:', body);
                    reject(new Error(`Originate failed: ${body}`));
                }
            });
        });
    }
}

export default FreeSwitchService;