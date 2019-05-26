import { Logger as NestLogger } from "@nestjs/common";

import {
  PrintLog as PrintLogCore,
  PrintLogProxy as PrintLogProxyCore,
  IPrintLogOptions
} from "./core/PrintLogger";

export const PrintLog = ({
  Logger = NestLogger,
  ...options
}: IPrintLogOptions = {}) => PrintLogCore({ Logger, ...options });

export const PrintLogProxy = PrintLogProxyCore({
  Logger: NestLogger
});
