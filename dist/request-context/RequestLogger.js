"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const ContextService_1 = require("./ContextService");
class RequestLogger extends common_1.Logger {
    log(message, context) {
        super.log(message, `${RequestLogger.getRequestId()}${context}`);
    }
    warn(message, context) {
        super.warn(message, `${RequestLogger.getRequestId()}${context}`);
    }
    error(message, trace, context) {
        super.error(message, trace, `${RequestLogger.getRequestId()}${context}`);
    }
    static getRequestId() {
        const id = ContextService_1.ContextService.get(ContextService_1.ContextService.REQUEST_ID);
        return id ? `${id}] [` : "";
    }
}
exports.RequestLogger = RequestLogger;
exports.default = new RequestLogger();
//# sourceMappingURL=RequestLogger.js.map