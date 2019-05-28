import { Logger } from "@nestjs/common";
import { ContextService } from "./ContextService";

export class RequestLogger extends Logger {
  constructor(private ContextService) {
    super();
  }
  log(message: any, context?: string) {
    super.log(message, `${this.buildTags()}${context}`);
  }

  warn(message: any, context?: string) {
    super.warn(message, `${this.buildTags()}${context}`);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, `${this.buildTags()}${context}`);
  }

  buildTags() {
    return this.ContextService.printTags();
  }
}

export default new RequestLogger(ContextService);
