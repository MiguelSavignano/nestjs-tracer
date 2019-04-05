import { Logger as NestLogger } from "@nestjs/common";

import {
  PrintLog as PrintLogCore,
  PrintLogProxy as PrintLogProxyCore
} from "./PrintLogger";

export const PrintLog = ({ Logger = NestLogger, ...options } = {}) =>
  PrintLogCore({ Logger, ...options });

export const PrintLogProxy = PrintLogProxyCore({ Logger: NestLogger });
