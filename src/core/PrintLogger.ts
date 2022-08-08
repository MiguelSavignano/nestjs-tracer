import * as CircularJSON from "circular-json";
import tracer from 'dd-trace';

export interface ILogger {
  log(message: any, context?: string): void;
  error(message: any, trace?: string, context?: string): void;
  warn(message: any, context?: string): void;
}

export interface IPrintLogOptions {
  Logger?: ILogger;
  parseResult?: (value: any) => any;
  parseArguments?: (value: any[]) => any[];
  parseError?: (value: any | Error) => any | Error;
}

export interface IPrintLogProxyOptions {
  className?: string;
  parseResult?: (value: any) => any;
  parseArguments?: (value: any[]) => any[];
  parseError?: (value: any | Error) => any | Error;
}

export const PrintLogProxy = ({ Logger }) => (
  instance,
  methodName,
  options: IPrintLogProxyOptions = {}
) => {
  const className = options.className || instance.constructor.name;
  const original = instance[methodName];

  const proxy = new DecoratorProxy(
    original,
    className,
    methodName,
    Logger,
    options
  ).build();
  instance[methodName] = proxy;
};

export const PrintLog = ({ Logger, ...options }: IPrintLogOptions) => (
  target,
  methodName,
  descriptor
) => {
  const className = target.constructor.name;
  const original = descriptor.value;
  const proxy = new DecoratorProxy(
    original,
    className,
    methodName,
    Logger,
    options
  ).build();
  descriptor.value = proxy;
};

export class DecoratorProxy {
  contextTag: string;

  constructor(
    private originalFnc,
    private className,
    private methodName,
    private Logger,
    private loggerOptions: IPrintLogOptions = {}
  ) {
    this.contextTag = `${this.className}#${this.methodName}`;
  }

  build() {
    return new Proxy(this.originalFnc, {
      apply: this.apply.bind(this)
    });
  }

  apply(target, thisArg, args) {
    this.printMessage("Request with args", this.parseArguments(args), "before");
    const currentSpan = tracer.scope().active();
    try {
      const childSpan = tracer.startSpan(this.contextTag, {childOf: currentSpan});
      const fncResult = target.apply(thisArg, args);

      if (fncResult instanceof Promise) {
        fncResult
          .then(result => {
            childSpan.finish();
            this.printMessageResult(result)
          })
          .catch(error => {
            childSpan.setTag('error', error);
            childSpan.finish();
            this.printMessageError(error);
          });
        return fncResult;
      } else {
        childSpan.finish();
        this.printMessageResult(fncResult);
        return fncResult;
      }
    } catch (error) {
      this.printMessageError(error);
      throw error;
    }
  }

  printMessage(message: string, value: any, type?: "before" | "after") {
    const valueToPrint =
      typeof value === "string" ? value : CircularJSON.stringify(value);
    this.Logger.log(`${message}`, {'data': valueToPrint, 'function':this.contextTag});
  }

  printMessageResult(result) {
    this.printMessage("Response", this.parseResult(result), "after");
  }

  printMessageError(error) {
    this.printMessage("Response Error", this.parseError(error), "after");
  }

  parseError(error: any | Error): any | string {
    if (this.loggerOptions.parseError) {
      return this.loggerOptions.parseError(error);
    }

    if (error instanceof Error) {
      return error.message;
    }
    return error;
  }

  parseArguments(value: any[]) {
    if (this.loggerOptions.parseArguments) {
      return this.loggerOptions.parseArguments(value);
    }
    return value;
  }

  parseResult(value: any) {
    if (this.loggerOptions.parseResult) {
      return this.loggerOptions.parseResult(value);
    }
    return value;
  }
}
