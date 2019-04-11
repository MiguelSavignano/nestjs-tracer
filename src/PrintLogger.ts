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

export const PrintLogProxy = ({ Logger }) => (
  instance,
  methodName,
  options: { className?: string } = {}
) => {
  const className = options.className || instance.constructor.name;
  const original = instance[methodName];
  const proxy = new Proxy(
    original,
    proxyHandler({ Logger, className, methodName })
  );
  instance[methodName] = proxy;
};

export const PrintLog = ({ Logger, ...options }: IPrintLogOptions) => (
  target,
  methodName,
  descriptor
) => {
  const className = target.constructor.name;
  const original = descriptor.value;
  const proxy = new Proxy(
    original,
    proxyHandler({ Logger, className, methodName, ...options })
  );
  descriptor.value = proxy;
};

const proxyHandler = ({
  Logger,
  className,
  methodName,
  printMessageFnc = printMessage,
  parseResult = value => value,
  parseArguments = value => value
}) => ({
  apply: function(target, thisArg, args) {
    const result = target.apply(thisArg, args);
    const contextTag = `${className}#${methodName}`;

    printMessageFnc(
      Logger,
      "Call with args:",
      parseArguments(args),
      contextTag,
      "before"
    );
    if (result instanceof Promise) {
      result
        .then(result =>
          printMessageFnc(
            Logger,
            "Return:",
            parseResult(result),
            contextTag,
            "after"
          )
        )
        .catch(error => {});
    } else {
      printMessage(Logger, "Return:", parseResult(result), contextTag, "after");
    }

    return result;
  }
});

export const printMessage = (
  Logger: ILogger,
  message: string,
  value: any,
  contextTag: string,
  type?: "before" | "after"
) => {
  Logger.log(`${message} ${CircularJSON.stringify(value)}`, contextTag);
};
