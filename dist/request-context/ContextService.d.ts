export declare class ContextService {
    static REQUEST_ID: string;
    static middlewareRequest(): any;
    static addTraces(_req: any, _res: any): void;
    static middleware(): (req: any, _res: any, next: any) => void;
    static setRequestId(): void;
    static set(key: string, value: any): void;
    static get(key: string): any;
}
