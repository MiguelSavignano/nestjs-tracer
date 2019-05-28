import { ContextService, PrintLog } from "..";
import { Logger } from "@nestjs/common";
import * as request from "supertest";
import * as express from "express";
import * as uuid from "uuid/v4";
jest.mock("uuid/v4");

const app = express();
app.use(ContextService.middlewareRequest());
app.use(ContextService.middleware());

class Dummy {
  @PrintLog()
  hello(name) {
    return `Hi ${name}`;
  }
}

app.get("/test", (req, res) => {
  const message = new Dummy().hello("Foo");
  res.send(message);
});

describe("App middleware", () => {
  it("generate uuid per request", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());

    await request(app)
      .get("/test")
      .expect(200);
    expect(spy).toBeCalled();

    // In the same request generate only one uuid
    expect(uuid).toBeCalledTimes(1);
    expect(spy).toBeCalledTimes(2);

    await request(app)
      .get("/test")
      .expect(200);

    expect(spy).toBeCalled();

    // generate new uuid for new request
    expect(uuid).toBeCalledTimes(2);
    expect(spy).toBeCalledTimes(4);
  });
});
