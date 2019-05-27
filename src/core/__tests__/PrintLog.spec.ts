import { PrintLog as PrintLogCore, IPrintLogOptions } from "../PrintLogger";
import { printMessage } from "../PrintLogger";

const PrintLog = ({ Logger = console, ...options }: IPrintLogOptions = {}) =>
  PrintLogCore({ Logger, ...options });

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
  async throwAsyncError(name) {
    throw new Error(`Custom message ${name}`);
  }

  @PrintLog()
  helloAsyncErrorPromise(name) {
    return new Promise((resolve, reject) => {
      reject(`Custom message ${name}`);
    });
  }
}

describe("PrintLog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("#PrintLog", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
    expect(new Dummy().hello("Foo")).toEqual(`Hi Foo`);
    expect(spy).toBeCalled();
  });

  it("#call with async funtion", async () => {
    const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
    expect(await new Dummy().helloAsync("Bazz")).toEqual(`Hi Bazz`);
    expect(spy).toBeCalled();
  });

  describe("handle errors", () => {
    it("promise rejects catch", async () => {
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
      try {
        await new Dummy().helloAsyncErrorPromise("Bazz");
      } catch (error) {
        expect(error).toEqual("Error Bazz");
        expect(spy).toHaveBeenNthCalledWith(
          1,
          'Call with args: ["Bazz"]',
          "Dummy#helloAsyncErrorPromise"
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          "Return: Error Bazz",
          "Dummy#helloAsyncErrorPromise"
        );
      }
    });

    it("async throw error", async () => {
      jest.clearAllMocks();
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
      try {
        await new Dummy().throwAsyncError("Bazz");
      } catch (error) {
        expect(error).toMatchInlineSnapshot(`[Error: Custom message Bazz]`);
        expect(spy).toHaveBeenNthCalledWith(
          1,
          'Call with args: ["Bazz"]',
          "Dummy#throwAsyncError"
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          "Return: Custom message Bazz",
          "Dummy#throwAsyncError"
        );
      }
    });
  });

  describe("#printMessage", () => {
    it("with simple object", () => {
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
      printMessage(console, "", { foo: "bazz" }, "Example#example");

      expect(spy).toBeCalledWith(' {"foo":"bazz"}', "Example#example");
    });

    it("with circular Object", () => {
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());

      const citcularObject = { foo: "bar" };
      citcularObject["self"] = citcularObject;

      printMessage(console, "", citcularObject, "Example#example");

      expect(spy).toBeCalled();
      expect(spy).toBeCalledWith(
        ' {"foo":"bar","self":"~"}',
        "Example#example"
      );
    });
  });
});

const parseResult = (value: any) => {
  delete value.token;
  return value;
};

const parseArguments = (value: any[]) => {
  return [];
};

class DummyOptions {
  @PrintLog({ parseResult, parseArguments })
  foo(secret) {
    return { token: "1234", result: { foo: "bar" } };
  }
}

describe("PrintLog options", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("parseArguments and parseResult", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
    new DummyOptions().foo("secret");

    expect(spy).toHaveBeenNthCalledWith(
      1,
      "Call with args: []",
      "DummyOptions#foo"
    );

    expect(spy).toHaveBeenNthCalledWith(
      2,
      'Return: {"result":{"foo":"bar"}}',
      "DummyOptions#foo"
    );
  });
});
