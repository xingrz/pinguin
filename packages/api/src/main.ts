import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { ENV, PORT } from '@/constants';
import { AppModule } from '@/app.module';

const app = await NestFactory.create<NestExpressApplication>(AppModule);

await app.listen(PORT);
console.log(`Server up with port: ${PORT}, env: ${ENV}`);

export * from '@/api/api.typing';
