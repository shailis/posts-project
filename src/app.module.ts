import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { I18nModule } from 'nestjs-i18n';

import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import * as path from 'path';
import { FeatureConfigModule } from '@app/feature-config';

@Module({
  imports: [
    FeatureConfigModule,
    JwtModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    PrismaModule,
    UserModule,
    PostModule,
  ],
})
export class AppModule {}
