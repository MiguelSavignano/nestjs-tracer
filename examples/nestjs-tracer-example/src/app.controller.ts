import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PrintLog, PrintLogAsync } from '../../../src/index';

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
    return `${this.appService.getHello()} ${input.name}`;
  }

  @Get('async')
  @PrintLogAsync
  async getHelloDtoAsync(@Query() input: GetHelloDto): Promise<string> {
    return `${this.appService.getHello()} ${input.name}`;
  }
}
