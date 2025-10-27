declare module 'modesl' {
  export class Connection {
    constructor(options: {
      host: string;
      port: number;
      password: string;
    });

    on(event: string, listener: (...args: any[]) => void): void;
    api(command: string, callback: (res: any) => void): void;
    close(): void;
  }
}
