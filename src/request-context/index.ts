import RequestLogger from "./RequestLogger";
export { ContextService } from "./ContextService";

import {
  PrintLog as PrintLogCore,
  PrintLogAsync as PrintLogCoreAsync
} from "../PrintLogger";

export const PrintLog = PrintLogCore(RequestLogger);
export const PrintLogAsync = PrintLogCoreAsync(RequestLogger);
export { RequestLogger };
