import RequestLogger from "./RequestLogger";
export { ContextService } from "./ContextService";

import {
  PrintLog as PrintLogCore,
  PrintLogAsync as PrintLogCoreAsync,
  PrintLogProxy as PrintLogProxyCore,
  PrintLogProxyAsync as PrintLogProxyCoreAsync
} from "../PrintLogger";

export const PrintLog = PrintLogCore(RequestLogger);
export const PrintLogAsync = PrintLogCoreAsync(RequestLogger);
export const PrintLogProxy = PrintLogProxyCore(RequestLogger);
export const PrintLogProxyAsync = PrintLogProxyCoreAsync(RequestLogger);
export { RequestLogger };
