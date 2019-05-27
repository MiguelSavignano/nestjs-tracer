import {
  PrintLog as PrintLogCore,
  IPrintLogOptions,
  DecoratorProxy
} from "../PrintLogger";

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
  throwError(name) {
    throw new Error(`Custom message ${name}`);
  }

  @PrintLog()
  async throwAsyncError(name) {
    throw new Error(`Custom message ${name}`);
  }

  @PrintLog()
  rejectErrorPromise(name) {
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
    it("trhow sync error", () => {
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
      try {
        new Dummy().throwError("Bazz");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(spy).toHaveBeenNthCalledWith(
          1,
          'Call with args: ["Bazz"]',
          "Dummy#throwError"
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          "Return: Custom message Bazz",
          "Dummy#throwError"
        );
      }
    });

    it("promise rejects catch", async () => {
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
      try {
        await new Dummy().rejectErrorPromise("Bazz");
      } catch (error) {
        expect(error).toEqual("Custom message Bazz");
        expect(spy).toHaveBeenNthCalledWith(
          1,
          'Call with args: ["Bazz"]',
          "Dummy#rejectErrorPromise"
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          "Return: Custom message Bazz",
          "Dummy#rejectErrorPromise"
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

  const decoratorProxy = new DecoratorProxy(
    () => {},
    "Example",
    "example",
    console
  );
  const printMessage = decoratorProxy.printMessage.bind(decoratorProxy);

  describe("#printMessage", () => {
    it("with simple object", () => {
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());
      printMessage("", { foo: "bazz" });

      expect(spy).toBeCalledWith(' {"foo":"bazz"}', "Example#example");
    });

    it("with circular Object", () => {
      const spy = jest.spyOn(console, "log").mockImplementation(jest.fn());

      const circularObject = { foo: "bar" };
      circularObject["self"] = circularObject;

      printMessage("", circularObject);

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
