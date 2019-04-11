import * as CircularJSON from "circular-json";

interface Logger {
  log(message: any, context?: string): void;
  error(message: any, trace?: string, context?: string): void;
  warn(message: any, context?: string): void;
}

interface PrintLogOptions {
  Logger: Logger;
}
export const PrintLogProxy = ({ Logger }: PrintLogOptions) => (
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

export const PrintLog = ({ Logger }: PrintLogOptions) => (
  target,
  methodName,
  descriptor
) => {
  const className = target.constructor.name;
  const original = descriptor.value;
  const proxy = new Proxy(
    original,
    proxyHandler({ Logger, className, methodName })
  );
  descriptor.value = proxy;
};

export const printMessage = (
  Logger: Logger,
  message: string,
  value: any,
  contextTag: string,
  type?: "before" | "after"
) => {
  Logger.log(`${message} ${CircularJSON.stringify(value)}`, contextTag);
};

const proxyHandler = ({
  Logger,
  className,
  methodName,
  printMessageFnc = printMessage
}) => ({
  apply: function(target, thisArg, args) {
    const result = target.apply(thisArg, args);
    const contextTag = `${className}#${methodName}`;

    printMessageFnc(Logger, "Call with args:", args, contextTag, "before");
    if (result instanceof Promise) {
      result
        .then(result =>
          printMessageFnc(Logger, "Return:", result, contextTag, "after")
        )
        .catch(error => {});
    } else {
      printMessage(Logger, "Return:", result, contextTag, "after");
    }

    return result;
  }
});
