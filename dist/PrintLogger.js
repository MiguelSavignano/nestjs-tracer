"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintLog = Logger => (target, name, descriptor) => {
    const className = target.constructor.name;
    const original = descriptor.value;
    descriptor.value = function (...args) {
        Logger.log(`Call with ARGS: ${JSON.stringify(args)}`, `${className}#${name}`);
        const result = original.apply(this, args);
        Logger.log(`Return: ${JSON.stringify(result)}`, `${className}#${name}`);
        return result;
    };
    return descriptor;
};
exports.PrintLogAsync = Logger => (target, name, descriptor) => {
    const className = target.constructor.name;
    const original = descriptor.value;
    descriptor.value = function (...args) {
        Logger.log(`Call with ARGS: ${JSON.stringify(args)}`, `${className}#${name}`);
        const result = original.apply(this, args);
        result
            .then(result => {
            Logger.log(`Return: ${JSON.stringify(result)}`, `${className}#${name}`);
        })
            .catch(error => { });
        return result;
    };
    return descriptor;
};
//# sourceMappingURL=PrintLogger.js.map