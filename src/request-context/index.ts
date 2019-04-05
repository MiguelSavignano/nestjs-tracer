import RequestLogger from "./RequestLogger";
export { ContextService } from "./ContextService";

import {
  PrintLog as PrintLogCore,
  PrintLogProxy as PrintLogProxyCore
} from "../PrintLogger";

export const PrintLog = PrintLogCore(RequestLogger);
export const PrintLogProxy = PrintLogProxyCore(RequestLogger);
export { RequestLogger };
