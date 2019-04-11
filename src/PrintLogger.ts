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
  value: any,
  contextTag: string,
  type: "before" | "after"
) => {
  const message = type === "after" ? "Return:" : "Call with args:";
  Logger.log(`${message} ${CircularJSON.stringify(value)}`, contextTag);
};

const handlerBeforeCall = ({
  Logger,
  className,
  methodName,
  args
}: {
  Logger: Logger;
  className: string;
  methodName: string;
  args: any;
}) => {
  printMessage(Logger, args, `${className}#${methodName}`, "before");
};

const handlerAfterCall = ({
  Logger,
  className,
  methodName,
  result
}: {
  Logger: Logger;
  className: string;
  methodName: string;
  result: any;
}) => {
  printMessage(Logger, result, `${className}#${methodName}`, "after");
};

const proxyHandler = ({
  Logger,
  className,
  methodName,
  onBeforeCall = handlerBeforeCall,
  onAfterCall = handlerAfterCall
}) => ({
  apply: function(target, thisArg, args) {
    const result = target.apply(thisArg, args);
    onBeforeCall({ Logger, className, methodName, args });
    if (result instanceof Promise) {
      result
        .then(result => onAfterCall({ Logger, className, methodName, result }))
        .catch(error => {});
    } else {
      onAfterCall({ Logger, className, methodName, result });
    }

    return result;
  }
});
