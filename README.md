## ClassLogger Nestjs

Use decorators for trace your class mehods

### PrintLog

```typecript
class Dummy {
  @PrintLog
  hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello('Foo')
// [Dummy#hello] Call with ARGS: ["Foo"]
// [Dummy#hello] Return: Hi Foo
```

### PrintLogAsync

```typecript
class Dummy {
  @PrintLogAsync
  async hello(name) {
    return `Hi ${name}`;
  }
}
new Dummy().hello('Foo')
// [Dummy#hello] Call with ARGS: ["Foo"]
// [Dummy#hello] Return: Hi Foo
```
