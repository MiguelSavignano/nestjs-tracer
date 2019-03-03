import { ContextServiceMiddleware, PrintLog } from "./request-context";
import { Logger } from "@nestjs/common";
import * as request from "supertest";
import * as express from "express";
import * as uuidv1 from "uuid/v1";
jest.mock("uuid/v1");

const app = express();
app.use(ContextServiceMiddleware);

class Dummy {
  @PrintLog
  hello(name) {
    return `Hi ${name}`;
  }
}

app.get("/test", (req, res) => {
  const message = new Dummy().hello("Foo");
  res.send(message);
});

describe("App middleware", () => {
  it("GET /test", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());

    await request(app)
      .get("/test")
      .expect(200);
    expect(spy).toBeCalled();
    expect(spy.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Call with ARGS: [\\"Foo\\"]"`
    );
    expect(spy.mock.calls[0][1]).toMatchInlineSnapshot(
      `"UUID_MOCK] [Dummy#hello"`
    );
    expect(spy.mock.calls[1][0]).toMatchInlineSnapshot(
      `"Return: \\"Hi Foo\\""`
    );
    expect(spy.mock.calls[1][1]).toMatchInlineSnapshot(
      `"UUID_MOCK] [Dummy#hello"`
    );

    // Use the same context
    await request(app)
      .get("/test")
      .expect(200);

    expect(spy).toBeCalled();
    expect(spy.mock.calls[1][0]).toMatchInlineSnapshot(
      `"Return: \\"Hi Foo\\""`
    );
    expect(spy.mock.calls[1][1]).toMatchInlineSnapshot(
      `"UUID_MOCK] [Dummy#hello"`
    );
    expect(spy.mock.calls[2][0]).toMatchInlineSnapshot(
      `"Call with ARGS: [\\"Foo\\"]"`
    );
    expect(spy.mock.calls[2][1]).toMatchInlineSnapshot(
      `"UUID_MOCK] [Dummy#hello"`
    );

    expect(uuidv1).toBeCalledTimes(1);
  });
});
