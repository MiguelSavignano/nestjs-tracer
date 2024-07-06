export class DecoratorProxy {
  contextTag: string;

  constructor(private originalFnc, private className, private methodName) {
    this.contextTag = `${this.className}#${this.methodName}`;
  }

  build() {
    return new Proxy(this.originalFnc, {
      apply: this.apply.bind(this),
    });
  }

  apply(target, thisArg, args) {
    this.before(args);
    try {
      const fncResult = target.apply(thisArg, args);

      if (fncResult instanceof Promise) {
        fncResult
          .then(result => this.afterSuccess(result, args))
          .catch(error => {
            this.afterFail(error, args);
          });
        return fncResult;
      }
      this.afterSuccess(fncResult, args);
      return fncResult;
    } catch (error) {
      this.afterFail(error, args);
      throw error;
    }
  }

  before(args) {
    console.log('Call with ', args);
  }

  afterSuccess(result, args) {
    console.log('Response with ', result);
  }

  afterFail(error, args) {
    console.error('Response fail with ', error);
  }
}

export const InterceptorProxy =
  (UseClass = DecoratorProxy) =>
  (instance, methodName, options: any = {}) => {
    const className = options.className || instance.constructor.name;
    const original = instance[methodName];

    const proxy = new UseClass(original, className, methodName).build();
    instance[methodName] = proxy;
  };
