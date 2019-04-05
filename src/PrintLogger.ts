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

export const PrintLogProxyAsync = Logger => (
  instance,
  methodName,
  options: { className?: string } = {}
) => {
  const className = options.className || instance.constructor.name;
  const original = instance[methodName];
  const proxy = new Proxy(
    original,
    proxyHandlerAsync({ Logger, className, methodName })
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

export const PrintLogAsync = Logger => (target, methodName, descriptor) => {
  const className = target.constructor.name;
  const original = descriptor.value;
  const proxy = new Proxy(
    original,
    proxyHandlerAsync({ Logger, className, methodName })
  );
  descriptor.value = proxy;
};

const proxyHandler = ({ Logger, className, methodName }) => ({
  apply: function(target, thisArg, args) {
    Logger.log(
      `Call with args: ${JSON.stringify(args)}`,
      `${className}#${methodName}`
    );
    const result = target.apply(thisArg, args);
    Logger.log(
      `Return: ${JSON.stringify(result)}`,
      `${className}#${methodName}`
    );
    return result;
  }
});

const proxyHandlerAsync = ({ Logger, className, methodName }) => ({
  apply: function(target, thisArg, args) {
    Logger.log(
      `Call with args: ${JSON.stringify(args)}`,
      `${className}#${methodName}`
    );
    const result = target.apply(thisArg, args);
    result
      .then(result => {
        Logger.log(
          `Return: ${JSON.stringify(result)}`,
          `${className}#${methodName}`
        );
      })
      .catch(error => {});
    return result;
  }
});
