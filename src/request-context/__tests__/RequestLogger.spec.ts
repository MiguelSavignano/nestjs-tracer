import requestLogger, { RequestLogger } from "../RequestLogger";
import { Logger } from "@nestjs/common";
import { ContextService } from "../ContextService";

jest.mock("uuid/v1");

describe("RequestLogger", () => {
  it("#log", () => {
    jest.clearAllMocks();
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    requestLogger.log("Message", "MyTag");
    expect(spy.mock.calls[0][0]).toEqual("Message");
    expect(spy.mock.calls[0][1]).toEqual("MyTag");
    expect(spy).toBeCalled();
  });

  it(".getRequestId missing context key, return empty key", () => {
    expect(requestLogger.buildTags()).toEqual("");
  });

  it("#buildTags", () => {
    const spy = jest.spyOn(ContextService, "printTags");
    requestLogger.buildTags();
    expect(spy).toBeCalled();
  });
});
