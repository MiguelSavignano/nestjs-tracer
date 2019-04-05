import { Logger } from "@nestjs/common";

import {
  PrintLog as PrintLogCore,
  PrintLogProxy as PrintLogProxyCore
} from "./PrintLogger";

export const PrintLog = PrintLogCore(Logger);
export const PrintLogProxy = PrintLogProxyCore(Logger);
