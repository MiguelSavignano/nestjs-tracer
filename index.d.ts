import { IPrintLogOptions } from "./core/PrintLogger";
export declare const PrintLog: ({ Logger, ...options }?: IPrintLogOptions) => (target: any, methodName: any, descriptor: any) => void;
export declare const PrintLogProxy: (instance: any, methodName: any, options?: import("./core/PrintLogger").IPrintLogProxyOptions) => void;
