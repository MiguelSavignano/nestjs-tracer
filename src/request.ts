import RequestLogger from "./RequestLogger";
import * as ContextService from "request-context";

import {
  PrintLog as PrintLogCore,
  PrintLogAsync as PrintLogCoreAsync
} from "./PrintLogger";

export const PrintLog = PrintLogCore(RequestLogger);
export const PrintLogAsync = PrintLogCoreAsync(RequestLogger);
export const ContextServiceMiddleware = ContextService.middleware("request");
