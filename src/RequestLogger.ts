import { Logger } from "@nestjs/common";
import * as ContextService from "request-context";
import * as uuidv1 from "uuid/v1";

const REQUEST_ID_KEY = "request:id";

export class RequestLogger extends Logger {
  log(message: string, context?: string) {
    super.log(message, `${RequestLogger.getRequestId()}${context}`);
  }

  warn(message: string, context?: string) {
    super.warn(message, `${RequestLogger.getRequestId()}${context}`);
  }

  error(message: string, trace: string, context?: string) {
    super.error(message, trace, `${RequestLogger.getRequestId()}${context}`);
  }

  static getRequestId(): string {
    try {
      let id = ContextService.get(REQUEST_ID_KEY);
      if (!id) {
        id = uuidv1();
        ContextService.set(REQUEST_ID_KEY, id);
      }
      return `${id}] [`;
    } catch (_) {
      return "";
    }
  }
}

export default new RequestLogger();
