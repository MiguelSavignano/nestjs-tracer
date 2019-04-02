export const PrintLogProxy = Logger => (
  instance,
  methodName,
  options: { className?: string } = {}
) => {
  const className = options.className || instance.constructor.name;
  const original = instance[methodName];
  const handler = {
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
  };
  const proxy = new Proxy(original, handler);
  instance[methodName] = proxy;
};

export const PrintLog = Logger => (target, name, descriptor) => {
  const className = target.constructor.name;
  const original = descriptor.value;

  const handler = {
    apply: function(target, thisArg, args) {
      Logger.log(
        `Call with args: ${JSON.stringify(args)}`,
        `${className}#${name}`
      );
      const result = target.apply(thisArg, args);
      Logger.log(`Return: ${JSON.stringify(result)}`, `${className}#${name}`);
      return result;
    }
  };
  const proxy = new Proxy(original, handler);
  descriptor.value = proxy;
};

export const PrintLogAsync = Logger => (target, name, descriptor) => {
  const className = target.constructor.name;
  const original = descriptor.value;

  const handler = {
    apply: function(target, thisArg, args) {
      Logger.log(
        `Call with args: ${JSON.stringify(args)}`,
        `${className}#${name}`
      );
      const result = original.apply(thisArg, args);
      result
        .then(result => {
          Logger.log(
            `Return: ${JSON.stringify(result)}`,
            `${className}#${name}`
          );
        })
        .catch(error => {});
      return result;
    }
  };
  const proxy = new Proxy(original, handler);
  descriptor.value = proxy;
};
