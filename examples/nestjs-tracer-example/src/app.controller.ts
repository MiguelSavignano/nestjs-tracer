import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiImplicitQuery } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiImplicitQuery({
    name: 'example',
    description: 'some',
    required: false,
    type: 'string',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
