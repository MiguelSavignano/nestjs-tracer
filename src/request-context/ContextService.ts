import * as ContextStore from "request-context";
import * as uuidv1 from "uuid/v1";

const tracesKeys: string[] = [];

export class ContextService {
  static REQUEST_ID = "request:id";

  static middlewareRequest() {
    return ContextStore.middleware("request");
  }

  static addTraces(_req, _res) {
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
    tracesKeys.push(key);
  }

  static printTags(): string {
    const tags = tracesKeys.map(traceKey => {
      return ContextStore.get(traceKey);
    });
    return tags.map(this.printTag).join("");
  }

  static printTag(value: string) {
    return value ? `${value}] [` : "";
  }
}
