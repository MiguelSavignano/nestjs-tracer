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
