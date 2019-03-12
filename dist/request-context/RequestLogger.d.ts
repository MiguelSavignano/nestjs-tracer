import { Logger } from "@nestjs/common";
export declare class RequestLogger extends Logger {
    log(message: string, context?: string): void;
    warn(message: string, context?: string): void;
    error(message: string, trace: string, context?: string): void;
    static getRequestId(): string;
}
declare const _default: RequestLogger;
export default _default;
