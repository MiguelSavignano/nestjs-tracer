"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const PrintLogger_1 = require("./PrintLogger");
exports.PrintLog = PrintLogger_1.PrintLog(common_1.Logger);
exports.PrintLogAsync = PrintLogger_1.PrintLogAsync(common_1.Logger);
//# sourceMappingURL=index.js.map