import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiImplicitQuery } from '@nestjs/swagger';
import { PrintLog, PrintLogAsync } from '../../../src/index';

import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class GetHelloDto {
  @ApiModelPropertyOptional()
  readonly name?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiImplicitQuery({
    name: 'example',
    description: 'some',
    required: false,
    type: 'string',
  })
  @PrintLog
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('dtoSync')
  // @PrintLog
  getHelloDto(@Query() input: GetHelloDto): string {
    return this.appService.getHello();
  }

  @Get('async')
  @ApiImplicitQuery({
    name: 'example',
    description: 'some',
    required: false,
    type: 'string',
  })
  @PrintLogAsync
  async getHelloAsync(): Promise<string> {
    return Promise.resolve(this.appService.getHello());
  }
}
