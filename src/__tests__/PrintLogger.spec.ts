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

  @PrintLogAsync
  async helloAsyncError(name) {
    throw new Error(`Error ${name}`);
  }

  // @PrintLogAsync
  helloAsyncErrorPromise(name) {
    console.error("Esto se llama solo una vez");
    return new Promise((resolve, reject) => {
      reject(`Error ${name}`);
    });
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

  it("#PrintLogAsync handler promise rejects catch", async () => {
    jest.clearAllMocks();
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    try {
      await new Dummy().helloAsyncErrorPromise("Bazz");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`"Error Bazz"`);
    }
  });

  it("#PrintLogAsync handler async rejects catch", async () => {
    jest.clearAllMocks();
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());
    try {
      await new Dummy().helloAsyncError("Bazz");
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`"Error Bazz"`);
    }
  });
});
