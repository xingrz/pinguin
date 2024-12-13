import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { WORKSPACE_ROOT } from '@/constants';

import { ApiModule } from '@/api/api.module';

@Module({
  imports: [
    ApiModule,
    ServeStaticModule.forRoot({
      rootPath: join(WORKSPACE_ROOT, 'packages/dashboard/dist'),
    }),
  ],
})
export class AppModule {
}
