"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestLogger_1 = require("./RequestLogger");
exports.RequestLogger = RequestLogger_1.default;
var ContextService_1 = require("./ContextService");
exports.ContextService = ContextService_1.ContextService;
const PrintLogger_1 = require("../PrintLogger");
exports.PrintLog = PrintLogger_1.PrintLog(RequestLogger_1.default);
exports.PrintLogAsync = PrintLogger_1.PrintLogAsync(RequestLogger_1.default);
//# sourceMappingURL=index.js.map