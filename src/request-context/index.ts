import RequestLogger from "./RequestLogger";
export { ContextService } from "./ContextService";

import {
  PrintLog as PrintLogCore,
  PrintLogProxy as PrintLogProxyCore,
  IPrintLogOptions
} from "../core/PrintLogger";

export const PrintLog = ({
  Logger = RequestLogger,
  ...options
}: IPrintLogOptions = {}) => PrintLogCore({ Logger, ...options });

export const PrintLogProxy = PrintLogProxyCore({
  Logger: RequestLogger
});

export { RequestLogger };
