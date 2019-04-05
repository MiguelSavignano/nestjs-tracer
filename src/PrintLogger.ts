export const PrintLogProxy = Logger => (
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

export const PrintLog = Logger => (target, methodName, descriptor) => {
  const className = target.constructor.name;
  const original = descriptor.value;
  const proxy = new Proxy(
    original,
    proxyHandler({ Logger, className, methodName })
  );
  descriptor.value = proxy;
};

const handlerBeforCall = ({ Logger, className, methodName, args }) => {
  Logger.log(
    `Call with args: ${JSON.stringify(args)}`,
    `${className}#${methodName}`
  );
};

const handlerAfterCall = ({ Logger, className, methodName, result }) => {
  Logger.log(`Return: ${JSON.stringify(result)}`, `${className}#${methodName}`);
};

const proxyHandler = ({
  Logger,
  className,
  methodName,
  onBeforeCall = handlerBeforCall,
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
