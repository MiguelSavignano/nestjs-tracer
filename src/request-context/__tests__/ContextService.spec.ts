import { ContextService } from "../ContextService";
import * as ContextStore from "request-context";

jest.mock("uuid/v1");

class ContextServiceCustom extends ContextService {
  static REQUEST_ID = "request:id";
  static REQUEST_IP = "request:ip";

  static addTraces(req, _res) {
    this.setTraceByUuid();
    this.set(this.REQUEST_IP, req.ip);
  }
}

describe("ContextService", () => {
  let spy;
  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest
      .spyOn(ContextStore, "set")
      .mockImplementation(jest.fn(() => true));
    ContextService.tracesKeys = [];
  });

  it(".printTags", () => {
    jest.spyOn(ContextStore, "get").mockImplementation(() => "UUID_MOCK");

    ContextService.middleware()({}, {}, () => {});

    expect(spy).toHaveBeenCalledWith("request:id", "UUID_MOCK");
    expect(ContextService.tracesKeys).toMatchInlineSnapshot(`
Array [
  "request:id",
]
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

    ContextServiceCustom.middleware()({ ip: "127.0.0.1" }, null, () => {});

    expect(spy).toBeCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("request:id", "UUID_MOCK");
    expect(spy).toHaveBeenLastCalledWith("request:ip", "127.0.0.1");
    expect(ContextServiceCustom.printTags()).toMatchInlineSnapshot(
      `"UUID_MOCK] [UUID_MOCK] ["`
    );
  });
});
