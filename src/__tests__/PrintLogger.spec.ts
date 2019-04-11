import * as fs from "fs";
import { PrintLog, PrintLogProxy } from "..";
import { Logger } from "@nestjs/common";
import { handlerBeforeCall } from "../PrintLogger";

class Dummy {
  @PrintLog()
  hello(name) {
    return `Hi ${name}`;
  }

  @PrintLog()
  async helloAsync(name) {
    return `Hi ${name}`;
  }

  @PrintLog()
  async helloAsyncError(name) {
    throw new Error(`Error ${name}`);
  }

  @PrintLog()
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

  it("#PrintLogProxy", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    const instance = { hello: async name => `Hi ${name}` };
    PrintLogProxy(instance, "hello");
    await instance.hello("Foo");
    expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "Object#hello");
    expect(spy).nthCalledWith(2, 'Return: "Hi Foo"', "Object#hello");
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

  it("#PrintLog", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    expect(await new Dummy().helloAsync("Bazz")).toEqual(`Hi Bazz`);
    expect(spy).toBeCalled();
  });

  it("#PrintLog handler promise rejects catch", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    try {
      await new Dummy().helloAsyncErrorPromise("Bazz");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`"Error Bazz"`);
      expect(spy).toBeCalled();
    }
  });

  it("#PrintLog handler async rejects catch", async () => {
    jest.clearAllMocks();
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    try {
      await new Dummy().helloAsyncError("Bazz");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[Error: Error Bazz]`);
      expect(spy).toBeCalled();
    }
  });

  describe("#handlerBeforeCall", () => {
    it("call", () => {
      const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
      handlerBeforeCall({
        Logger,
        className: "Example",
        methodName: "example",
        args: [1, 2]
      });

      expect(spy).toBeCalledWith("Call with args: [1,2]", "Example#example");
    });

    it("circular Object", () => {
      const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());

      const object = { arr: undefined, obj: undefined };
      object.arr = [object, object];
      object.arr.push(object.arr);
      object.obj = object;

      handlerBeforeCall({
        Logger,
        className: "Example",
        methodName: "example",
        args: object
      });

      expect(spy).toBeCalled();
    });
  });
});
