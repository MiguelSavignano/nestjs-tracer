import RequestLogger from "./RequestLogger";
export { ContextService } from "./ContextService";

import {
  PrintLog as PrintLogCore,
  PrintLogProxy as PrintLogProxyCore
} from "../PrintLogger";

export const PrintLog = PrintLogCore({ Logger: RequestLogger });
export const PrintLogProxy = PrintLogProxyCore({
  Logger: RequestLogger
});
export { RequestLogger };
