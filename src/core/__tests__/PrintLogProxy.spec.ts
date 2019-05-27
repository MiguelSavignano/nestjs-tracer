import * as fs from "fs";
import { PrintLogProxy as PrintLogProxyCore } from "../PrintLogger";
import { Logger } from "@nestjs/common";

const PrintLogProxy = PrintLogProxyCore({ Logger });

describe("PrintLogProxy", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("#PrintLogProxy", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    const instance = { hello: async name => `Hi ${name}` };
    PrintLogProxy(instance, "hello");
    await instance.hello("Foo");
    expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "Object#hello");
    expect(spy).nthCalledWith(2, "Return: Hi Foo", "Object#hello");
  });

  it("call", () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    const instance = { hello: name => `Hi ${name}` };
    PrintLogProxy(instance, "hello");
    expect(instance.hello("Foo")).toEqual(`Hi Foo`);
    expect(spy).toBeCalled();
    expect(spy).nthCalledWith(1, 'Call with args: ["Foo"]', "Object#hello");
    expect(spy).nthCalledWith(2, "Return: Hi Foo", "Object#hello");
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

const parseResult = (value: any) => {
  delete value.token;
  return value;
};

const parseArguments = value => {
  return [];
};

describe("PrintLogProxy options", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("parseArguments and parseResult", () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    const instance = {
      foo: secret => ({ token: "1234", result: { foo: "bar" } })
    };
    PrintLogProxy(instance, "foo", { parseArguments, parseResult });
    instance.foo("Secret");

    expect(spy.mock.calls[0][0]).toEqual("Call with args: []");
    expect(spy.mock.calls[1][0]).toEqual('Return: {"result":{"foo":"bar"}}');
  });
});
