import { ContextService } from "../ContextService";
import * as ContextStore from "request-context";

jest.mock("uuid/v1");

class ContextServiceCustom extends ContextService {
  static REQUEST_IP = "request:ip";

  static addTraces(req, _res) {
    this.set(this.REQUEST_IP, req.ip);
  }
}

describe("ContextService", () => {
  it(".middleware set request id with UUID", () => {
    jest.clearAllMocks();
    const spy = jest
      .spyOn(ContextStore, "set")
      .mockImplementation(jest.fn(() => true));
    ContextService.middleware()({}, {}, () => {});
    expect(spy).toBeCalled();
    expect(spy).toHaveBeenCalledWith("request:id", "UUID_MOCK");
  });
});

describe("ContextServiceCustom", () => {
  it(".middleware set request id with UUID and add ip", () => {
    jest.clearAllMocks();
    const spy = jest
      .spyOn(ContextStore, "set")
      .mockImplementation(jest.fn(() => true));
    ContextServiceCustom.middleware()(
      {
        ip: "127.0.0.1"
      },
      {},
      () => {}
    );
    expect(spy).toBeCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("request:id", "UUID_MOCK");
    expect(spy).toHaveBeenLastCalledWith("request:ip", "127.0.0.1");
  });
});
