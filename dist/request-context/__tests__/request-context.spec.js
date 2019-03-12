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
const request = require("supertest");
const express = require("express");
const uuidv1 = require("uuid/v1");
jest.mock("uuid/v1");
const app = express();
app.use(__1.ContextService.middlewareRequest());
app.use(__1.ContextService.middleware());
class Dummy {
    hello(name) {
        return `Hi ${name}`;
    }
}
__decorate([
    __1.PrintLog,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Dummy.prototype, "hello", null);
app.get("/test", (req, res) => {
    const message = new Dummy().hello("Foo");
    res.send(message);
});
describe("App middleware", () => {
    it("generate uuid per request", () => __awaiter(this, void 0, void 0, function* () {
        const spy = jest.spyOn(common_1.Logger, "log").mockImplementation(jest.fn());
        yield request(app)
            .get("/test")
            .expect(200);
        expect(spy).toBeCalled();
        expect(uuidv1).toBeCalledTimes(1);
        expect(spy).toBeCalledTimes(2);
        yield request(app)
            .get("/test")
            .expect(200);
        expect(spy).toBeCalled();
        expect(uuidv1).toBeCalledTimes(2);
        expect(spy).toBeCalledTimes(4);
    }));
});
//# sourceMappingURL=request-context.spec.js.map