import * as CircularJSON from "circular-json";

export interface ILogger {
  log(message: any, context?: string): void;
  error(message: any, trace?: string, context?: string): void;
  warn(message: any, context?: string): void;
}

export interface IPrintLogOptions {
  Logger?: ILogger;
  parseResult?: (value: any) => any;
  parseArguments?: (value: any[]) => any[];
}

export interface IPrintLogProxyOptions {
  className?: string;
  parseResult?: (value: any) => any;
  parseArguments?: (value: any[]) => any[];
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
    this.printMessage("Call with args:", this.parseArguments(args), "before");
    try {
      const fncResult = target.apply(thisArg, args);

      if (fncResult instanceof Promise) {
        fncResult
          .then(result => this.printMessageResult(result))
          .catch(error => {
            this.printMessageError(error);
          });
        return fncResult;
      } else {
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
    this.Logger.log(`${message} ${valueToPrint}`, this.contextTag);
  }

  printMessageResult(result) {
    this.printMessage("Return:", this.parseResult(result), "after");
  }

  printMessageError(error) {
    this.printMessage("Return:", this.parseError(error), "after");
  }

  parseError(error: any | Error): any | string {
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
