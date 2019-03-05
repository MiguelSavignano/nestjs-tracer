import * as ContextStore from "request-context";
import * as uuidv1 from "uuid/v1";

export class ContextService {
  static REQUEST_ID = "request:id";

  static middlewareRequest() {
    return ContextStore.middleware("request");
  }

  static addTraces(_req, _res) {}

  static middleware() {
    return (req, _res, next) => {
      this.setRequestId();
      this.addTraces(req, _res);
      next();
    };
  }

  static setRequestId() {
    this.set(this.REQUEST_ID, uuidv1());
  }

  static set(key: string, value: any) {
    ContextStore.set(key, value);
  }

  static get(key: string): any {
    return ContextStore.get(key);
  }
}
