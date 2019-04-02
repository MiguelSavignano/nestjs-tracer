import * as fs from "fs";
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
      const instance = { hello: name => `Hi ${name}` };
      PrintLogProxy(instance, "hello");
      expect(instance.hello("Foo")).toEqual(`Hi Foo`);
      expect(spy).toBeCalled();
      expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "Object#hello");
      expect(spy).nthCalledWith(2, 'Return: "Hi Foo"', "Object#hello");
    });

    it("change className", () => {
      const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
      const instance = { hello: name => `Hi ${name}` };
      PrintLogProxy(instance, "hello", { className: "Dummy" });
      instance.hello("Foo");
      expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "Dummy#hello");
    });

    it("with custom class", () => {
      const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
      class Dummy {
        hello(name) {
          `Hi ${name}`;
        }
      }
      const instance = new Dummy();
      PrintLogProxy(instance, "hello");
      instance.hello("Foo");
      expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "Dummy#hello");
    });

    it("example for fs object", () => {
      const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
      PrintLogProxy(fs, "existsSync", { className: "Fs" });
      fs.existsSync(`./package.json`);
      expect(spy).nthCalledWith(
        1,
        'Call with args: ["./package.json"]',
        "Fs#existsSync"
      );
      expect(spy).nthCalledWith(2, "Return: true", "Fs#existsSync");
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
