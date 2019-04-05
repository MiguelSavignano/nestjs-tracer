import { Logger } from "@nestjs/common";
import { ContextService } from "./ContextService";

export class RequestLogger extends Logger {
  log(message: any, context?: string) {
    super.log(message, `${RequestLogger.getRequestId()}${context}`);
  }

  warn(message: any, context?: string) {
    super.warn(message, `${RequestLogger.getRequestId()}${context}`);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, `${RequestLogger.getRequestId()}${context}`);
  }

  static getRequestId(): string {
    const id = ContextService.get(ContextService.REQUEST_ID);
    return id ? `${id}] [` : "";
  }
}

export default new RequestLogger();
