import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiImplicitQuery } from '@nestjs/swagger';
import { PrintLog } from '../../../src/index';

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
}
