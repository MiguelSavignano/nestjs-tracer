import { Logger } from "@nestjs/common";

import {
  PrintLog as PrintLogCore,
  PrintLogAsync as PrintLogCoreAsync
} from "./PrintLogger";

export const PrintLog = PrintLogCore(Logger);
export const PrintLogAsync = PrintLogCoreAsync(Logger);
