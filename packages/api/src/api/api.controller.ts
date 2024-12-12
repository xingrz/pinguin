import { Controller, Get } from '@nestjs/common';

import { readFile } from 'fs/promises';
import { parse as parseYaml } from 'yaml';

import { CONFIG_FILE } from '@/constants';

import type { API } from './api.typing';

@Controller('api')
export class ApiController {
  @Get('config')
  async getConfig(): Promise<API.Config> {
    return parseYaml(await readFile(CONFIG_FILE, 'utf8')) as API.Config;
  }
}
