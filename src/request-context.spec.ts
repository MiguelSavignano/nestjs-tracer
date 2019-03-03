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
  it("generate uuid per request", async () => {
    const spy = jest.spyOn(Logger, "log").mockImplementation(jest.fn());

    await request(app)
      .get("/test")
      .expect(200);
    expect(spy).toBeCalled();

    // In the same request generate only one uuid
    expect(uuidv1).toBeCalledTimes(1);
    expect(spy).toBeCalledTimes(2);

    await request(app)
      .get("/test")
      .expect(200);

    expect(spy).toBeCalled();

    // generate new uuid for new request
    expect(uuidv1).toBeCalledTimes(2);
    expect(spy).toBeCalledTimes(4);
  });
});
