import { PrintLog, PrintLogAsync } from "..";
import { Logger } from "@nestjs/common";

class Dummy {
  @PrintLog
  hello(name) {
    return `Hi ${name}`;
  }

  @PrintLogAsync
  async helloAsync(name) {
    return `Hi ${name}`;
  }
}

describe("PrintLog", () => {
  it("#PrintLog", () => {
    jest.clearAllMocks();
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    expect(new Dummy().hello("Foo")).toEqual(`Hi Foo`);
    expect(spy).toBeCalled();
  });

  it("#PrintLogAsync", async () => {
    jest.clearAllMocks();
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    expect(await new Dummy().helloAsync("Bazz")).toEqual(`Hi Bazz`);
    expect(spy).toBeCalled();
  });
});
