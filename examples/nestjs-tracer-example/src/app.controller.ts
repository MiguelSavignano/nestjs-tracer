import { Controller, Get, Query, Logger } from '@nestjs/common';
import { AppService } from './app.service';

import { ApiModelPropertyOptional } from '@nestjs/swagger';

export const PrintLog = function(target, name, descriptor) {
  const className = target.constructor.name;
  const original = descriptor.value;

  const handler = {
    apply: function(target, thisArg, args) {
      Logger.log(
        `Call with args: ${JSON.stringify(args)}`,
        `${className}#${name}`,
      );
      const result = target.apply(thisArg, args);
      Logger.log(`Return: ${JSON.stringify(result)}`, `${className}#${name}`);
      return result;
    },
  };
  const proxy = new Proxy(original, handler);
  descriptor.value = proxy;
};

export const PrintLogAsync = function(target, name, descriptor) {
  const className = target.constructor.name;
  const original = descriptor.value;

  const handler = {
    apply: function(target, thisArg, args) {
      Logger.log(
        `Call with args: ${JSON.stringify(args)}`,
        `${className}#${name}`,
      );
      const result = original.apply(thisArg, args);
      result
        .then(result => {
          Logger.log(
            `Return: ${JSON.stringify(result)}`,
            `${className}#${name}`,
          );
        })
        .catch(error => {});
      return result;
    },
  };
  const proxy = new Proxy(original, handler);
  descriptor.value = proxy;
};

export class GetHelloDto {
  @ApiModelPropertyOptional()
  readonly name?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @PrintLog
  getHelloDto(@Query() input: GetHelloDto): string {
    // return `hello world ${input.name}`;
    return this.appService.getHello();
  }

  @Get('async')
  @PrintLogAsync
  async getHelloDtoAsync(@Query() input: GetHelloDto): Promise<string> {
    return `${this.appService.getHello()}-${input.name}`;
  }
}
