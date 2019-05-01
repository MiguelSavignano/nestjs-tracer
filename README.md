# Nestjs tracer

[![npm package](https://img.shields.io/npm/v/nestjs-tracer.svg)](https://www.npmjs.com/package/nestjs-tracer) [![code documentation](https://img.shields.io/badge/Code-documentation-blue.svg)](https://miguelsavignano.github.io/nestjs-tracer/globals.html)
[![Maintainability](https://api.codeclimate.com/v1/badges/8b4c8280e6801cce4ad6/maintainability)](https://codeclimate.com/github/MiguelSavignano/nestjs-tracer/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/8b4c8280e6801cce4ad6/test_coverage)](https://codeclimate.com/github/MiguelSavignano/nestjs-tracer/test_coverage)

Use decorators for trace your class methods

## Install

```
npm install nestjs-tracer --save
```

## Usage

### PrintLog

```javascript
import { PrintLog } from "nestjs-tracer";

class Dummy {
  @PrintLog()
  hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello("Foo");
// [Dummy#hello] Call with args: ["Foo"]
// [Dummy#hello] Return: Hi Foo
```

### PrintLog async functions

```javascript
import { PrintLog } from "nestjs-tracer";

class Dummy {
  @PrintLog()
  async hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello("Foo");
// [Dummy#hello] Call with args: ["Foo"]
// [Dummy#hello] Return: Hi Foo
```

### PrintLogProxy

PrintLog for any instance.

```javascript
import { PrintLogProxy } from "nestjs-tracer";

import * as fs from "fs";
PrintLogProxy(fs, "existsSync", { className: "Fs" });
fs.existsSync(`./package.json`);
// [Fs#existsSync] Call with args: ["./package.json"]
// [Fs#existsSync] Return: true
```

## Request context

Help to trace called methods in the same request.

Request context, generate one uuid per request.

Install request-context

```
npm install request-context --save
```

Example:

- Configure express app with request-context middleware

```js
// main.ts
import { ContextService, RequestLogger } from "nestjs-tracer/request-context";
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
  @PrintLog()
  hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello("Foo");
// f45bg6-56bh-hfc3n-jhu76j [Dummy#hello] Return: Hi Foo
```

## PrintLog Options

- Hidden secret information in logs

### parseResult

```typescript
class Dummy {
  @PrintLog({ parseResult: value => ({ ...value, token: "*********" }) })
  foo(secret) {
    return { token: "1234", result: { foo: "bar" } };
  }
}
```

### parseArguments

```typescript
class Dummy {
  @PrintLog({ parseArguments: (value: any[]) => ["secret*****"] })
  foo(secret) {
    return { token: "1234", result: { foo: "bar" } };
  }
}
```
