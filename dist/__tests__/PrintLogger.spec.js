"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const common_1 = require("@nestjs/common");
class Dummy {
    hello(name) {
        return `Hi ${name}`;
    }
    helloAsync(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return `Hi ${name}`;
        });
    }
}
__decorate([
    __1.PrintLog,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Dummy.prototype, "hello", null);
__decorate([
    __1.PrintLogAsync,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Dummy.prototype, "helloAsync", null);
describe("PrintLog", () => {
    it("#PrintLog", () => {
        jest.clearAllMocks();
        const spy = jest.spyOn(common_1.Logger, "log").mockImplementation(jest.fn());
        expect(new Dummy().hello("Foo")).toEqual(`Hi Foo`);
        expect(spy).toBeCalled();
    });
    it("#PrintLogAsync", () => __awaiter(this, void 0, void 0, function* () {
        jest.clearAllMocks();
        const spy = jest.spyOn(common_1.Logger, "log").mockImplementation(jest.fn());
        expect(yield new Dummy().helloAsync("Bazz")).toEqual(`Hi Bazz`);
        expect(spy).toBeCalled();
    }));
});
//# sourceMappingURL=PrintLogger.spec.js.map