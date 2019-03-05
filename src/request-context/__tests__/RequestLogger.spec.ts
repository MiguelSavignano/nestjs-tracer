import requestLogger, { RequestLogger } from "../RequestLogger";
import { Logger } from "@nestjs/common";
import * as ContextService from "request-context";
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
    expect(RequestLogger.getRequestId()).toEqual("");
  });

  it(".getRequestId use context key", () => {
    jest.clearAllMocks();
    const spy = jest
      .spyOn(ContextService, "get")
      .mockImplementation(jest.fn(() => "CONTEXT_KEY"));

    expect(RequestLogger.getRequestId()).toEqual("CONTEXT_KEY] [");
    expect(spy).toBeCalled();
  });
});
