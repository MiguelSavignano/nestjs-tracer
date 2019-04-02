import { Logger } from "@nestjs/common";

import {
  PrintLog as PrintLogCore,
  PrintLogAsync as PrintLogCoreAsync,
  PrintLogProxy as PrintLogProxyCore,
  PrintLogProxyAsync as PrintLogProxyCoreAsync
} from "./PrintLogger";

export const PrintLog = PrintLogCore(Logger);
export const PrintLogAsync = PrintLogCoreAsync(Logger);
export const PrintLogProxy = PrintLogProxyCore(Logger);
export const PrintLogProxyAsync = PrintLogProxyCoreAsync(Logger);
