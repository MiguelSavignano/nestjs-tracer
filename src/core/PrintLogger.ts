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

  const proxy = new Proxy(
    original,
    proxyHandler({
      Logger,
      className,
      methodName,
      ...options
    })
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

const returnSameValue = value => value;

const returnErrorMessage = (error: any | Error): any | string => {
  if (error instanceof Error) {
    return error.message;
  }
  return error;
};

const proxyHandler = ({
  Logger,
  className,
  methodName,
  parseResult = returnSameValue,
  parseError = returnErrorMessage,
  parseArguments = returnSameValue
}) => ({
  apply: function(target, thisArg, args) {
    const contextTag = `${className}#${methodName}`;
    printMessage(
      Logger,
      "Call with args:",
      parseArguments(args),
      contextTag,
      "before"
    );
    const printMessageResult = result => {
      printMessage(Logger, "Return:", parseResult(result), contextTag, "after");
    };
    const printMessageError = error => {
      printMessage(Logger, "Return:", parseError(error), contextTag, "after");
    };

    try {
      const fncResult = target.apply(thisArg, args);

      if (fncResult instanceof Promise) {
        fncResult
          .then(result => printMessageResult(result))
          .catch(error => {
            printMessageError(error);
          });
        return fncResult;
      } else {
        printMessageResult(fncResult);
        return fncResult;
      }
    } catch (error) {
      printMessageError(error);
      throw error;
    }
  }
});

export const printMessage = (
  Logger: ILogger,
  message: string,
  value: any,
  contextTag: string,
  type?: "before" | "after"
) => {
  const valueToPrint =
    typeof value === "string" ? value : CircularJSON.stringify(value);
  Logger.log(`${message} ${valueToPrint}`, contextTag);
};
