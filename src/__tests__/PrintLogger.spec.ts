import { PrintLog, PrintLogAsync, PrintLogProxy } from "..";

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

  @PrintLogAsync
  async helloAsyncError(name) {
    throw new Error(`Error ${name}`);
  }

  @PrintLogAsync
  helloAsyncErrorPromise(name) {
    return new Promise((resolve, reject) => {
      reject(`Error ${name}`);
    });
  }
}

describe("PrintLog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("#PrintLogProxy", () => {
    it("call", () => {
      const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
      const instance = { hi: name => `Hi ${name}` };
      PrintLogProxy(instance, "hi");
      expect(instance.hi("Foo")).toEqual(`Hi Foo`);
      expect(spy).toBeCalled();
      expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "object#hi");
      expect(spy).nthCalledWith(2, 'Return: "Hi Foo"', "object#hi");
    });

    it("change className", () => {
      const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
      const instance = { hi: name => `Hi ${name}` };
      PrintLogProxy(instance, "hi", { className: "Dummy" });
      instance.hi("Foo");
      expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "Dummy#hi");
    });
  });

  it("#PrintLog", () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    expect(new Dummy().hello("Foo")).toEqual(`Hi Foo`);
    expect(spy).toBeCalled();
  });

  it("#PrintLogAsync", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    expect(await new Dummy().helloAsync("Bazz")).toEqual(`Hi Bazz`);
    expect(spy).toBeCalled();
  });

  it("#PrintLogAsync handler promise rejects catch", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    try {
      await new Dummy().helloAsyncErrorPromise("Bazz");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`"Error Bazz"`);
      expect(spy).toBeCalled();
    }
  });

  it("#PrintLogAsync handler async rejects catch", async () => {
    jest.clearAllMocks();
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    try {
      await new Dummy().helloAsyncError("Bazz");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[Error: Error Bazz]`);
      expect(spy).toBeCalled();
    }
  });
});
