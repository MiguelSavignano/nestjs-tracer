import { ContextService } from "../ContextService";
import * as ContextStore from "request-context";

jest.mock("uuid/v1");

describe("ContextService", () => {
  let spy;
  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest
      .spyOn(ContextStore, "set")
      .mockImplementation(jest.fn(() => true));
    ContextService.tracesKeys = new Set();
  });

  it(".printTags", () => {
    jest.spyOn(ContextStore, "get").mockImplementation(() => "UUID_MOCK");

    ContextService.middleware()({}, {}, () => {});

    expect(spy).toHaveBeenCalledWith("request:id", "UUID_MOCK");
    expect(ContextService.tracesKeys).toMatchInlineSnapshot(`
Set {
  "request:id",
}
`);
    expect(ContextService.printTags()).toMatchInlineSnapshot(`"UUID_MOCK] ["`);
  });

  it(".middleware set request id with UUID", () => {
    ContextService.middleware()({}, {}, () => {});

    expect(spy).toBeCalled();
    expect(spy).toHaveBeenCalledWith("request:id", "UUID_MOCK");
  });

  it(".middleware set request id with UUID and add ip", () => {
    jest.spyOn(ContextStore, "get").mockImplementation(() => "UUID_MOCK");

    const addTraces = function(req) {
      this.setTraceByUuid();
      this.set("request:ip", req.ip);
    };
    ContextService.middleware({ addTraces })(
      { ip: "127.0.0.1" },
      null,
      () => {}
    );

    expect(spy).toBeCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("request:id", "UUID_MOCK");
    expect(spy).toHaveBeenLastCalledWith("request:ip", "127.0.0.1");
    expect(ContextService.printTags()).toMatchInlineSnapshot(
      `"UUID_MOCK] [UUID_MOCK] ["`
    );
  });
});
