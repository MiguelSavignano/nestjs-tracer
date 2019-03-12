"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestLogger_1 = require("../RequestLogger");
const common_1 = require("@nestjs/common");
const ContextService = require("request-context");
jest.mock("uuid/v1");
describe("RequestLogger", () => {
    it("#log", () => {
        jest.clearAllMocks();
        const spy = jest.spyOn(common_1.Logger, "log").mockImplementation(jest.fn());
        RequestLogger_1.default.log("Message", "MyTag");
        expect(spy.mock.calls[0][0]).toEqual("Message");
        expect(spy.mock.calls[0][1]).toEqual("MyTag");
        expect(spy).toBeCalled();
    });
    it(".getRequestId missing context key, return empty key", () => {
        expect(RequestLogger_1.RequestLogger.getRequestId()).toEqual("");
    });
    it(".getRequestId use context key", () => {
        jest.clearAllMocks();
        const spy = jest
            .spyOn(ContextService, "get")
            .mockImplementation(jest.fn(() => "CONTEXT_KEY"));
        expect(RequestLogger_1.RequestLogger.getRequestId()).toEqual("CONTEXT_KEY] [");
        expect(spy).toBeCalled();
    });
});
//# sourceMappingURL=RequestLogger.spec.js.map