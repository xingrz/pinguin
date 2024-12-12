import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { readFile } from 'fs/promises';
import { parse as parseYaml } from 'yaml';

import { CONFIG_FILE } from '@/constants';

import type { API } from './api.typing';

@Controller('api')
export class ApiController {
  private readonly status: API.PingMatrix = {};

  @Get('config')
  async getConfig(): Promise<API.Config> {
    return parseYaml(await readFile(CONFIG_FILE, 'utf8')) as API.Config;
  }

  @Get('ping')
  getPings(): API.PingMatrix {
    return this.status;
  }

  @Post('ping')
  @HttpCode(HttpStatus.NO_CONTENT)
  reportPing(@Body() { src, dst, ping }: API.PingReport): void {
    this.status[src] ??= {};
    this.status[src][dst] = { ping, updatedAt: new Date().toISOString() };
  }
}
