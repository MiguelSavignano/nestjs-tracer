"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContextStore = require("request-context");
const uuidv1 = require("uuid/v1");
class ContextService {
    static middlewareRequest() {
        return ContextStore.middleware("request");
    }
    static addTraces(_req, _res) { }
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
    static set(key, value) {
        ContextStore.set(key, value);
    }
    static get(key) {
        return ContextStore.get(key);
    }
}
ContextService.REQUEST_ID = "request:id";
exports.ContextService = ContextService;
//# sourceMappingURL=ContextService.js.map