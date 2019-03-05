## Nestjs tracer

Use decorators for trace your class methods

### PrintLog

```javascript
class Dummy {
  @PrintLog
  hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello("Foo");
// [Dummy#hello] Call with ARGS: ["Foo"]
// [Dummy#hello] Return: Hi Foo
```

### PrintLogAsync

```javascript
class Dummy {
  @PrintLogAsync
  async hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello("Foo");
// [Dummy#hello] Call with ARGS: ["Foo"]
// [Dummy#hello] Return: Hi Foo
```

## Request context

Help to trace called methods in the same request.

Requestc context, generate one uuid per request.

Example:

- Configure express app with request-context middleware

```js
// main.ts
import { ContextService, RequestLogger } from "./request-context";
async function bootstrap() {
  // ...
  const app = await NestFactory.create(AppModule, {
    logger: false
  });
  app.use(ContextService.middlewareRequest());
  app.use(ContextService.middleware());
  app.useLogger(RequestLogger);
  // ...
}
```

- Use PrintLog decorator using the express request context.

```javascript
import { PrintLog } from "nestjs-tracer/request-context";
class Dummy {
  @PrintLog
  hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello("Foo");
// f45bg6-56bh-hfc3n-jhu76j [Dummy#hello] Return: Hi Foo
```