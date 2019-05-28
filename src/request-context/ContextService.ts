import * as ContextStore from "request-context";
import * as uuid from "uuid/v4";

export class ContextService {
  static tracesKeys = new Set();

  static middlewareRequest() {
    return ContextStore.middleware("request");
  }

  static addTraces(_req, _res) {
    this.setTraceByUuid();
  }

  static setTraceByUuid(key = "request:id") {
    this.set(key, uuid());
  }

  static middleware({ addTraces = this.addTraces } = {}) {
    return (req, _res, next) => {
      addTraces.bind(this)(req, _res);
      next();
    };
  }

  static set(key: string, value: any) {
    ContextStore.set(key, value);
    this.tracesKeys.add(key);
  }

  static printTags(): string {
    const tags = Array.from(this.tracesKeys).map(traceKey => {
      return ContextStore.get(traceKey);
    });
    return tags.map(this.printTag).join("");
  }

  private static printTag(value: string) {
    return value ? `${value}] [` : "";
  }
}
