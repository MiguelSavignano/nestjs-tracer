import { Logger } from "@nestjs/common";

import {
  PrintLog as PrintLogCore,
  PrintLogAsync as PrintLogCoreAsync,
  PrintLogProxy as PrintLogProxyCore
} from "./PrintLogger";

export const PrintLog = PrintLogCore(Logger);
export const PrintLogAsync = PrintLogCoreAsync(Logger);
export const PrintLogProxy = PrintLogProxyCore(Logger);
