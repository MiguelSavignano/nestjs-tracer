import * as ContextStore from "request-context";
import * as uuidv1 from "uuid/v1";

export class ContextService {
  static tracesKeys: string[] = [];

  static REQUEST_ID = "request:id";

  static middlewareRequest() {
    return ContextStore.middleware("request");
  }

  static addTraces(_req, _res) {
    this.setTraceByUuid();
  }

  static setTraceByUuid() {
    this.set(this.REQUEST_ID, uuidv1());
  }

  static middleware() {
    return (req, _res, next) => {
      this.addTraces(req, _res);
      next();
    };
  }

  static set(key: string, value: any) {
    ContextStore.set(key, value);
    this.tracesKeys.push(key);
  }

  static printTags(): string {
    const tags = this.tracesKeys.map(traceKey => {
      return ContextStore.get(traceKey);
    });
    return tags.map(this.printTag).join("");
  }

  private static printTag(value: string) {
    return value ? `${value}] [` : "";
  }
}
