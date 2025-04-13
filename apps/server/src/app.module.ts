import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { GroupsModule } from './groups/groups.module'
import { ProjectModule } from './project/project.module';
import { YGateway } from './y/y.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    ProjectModule
  ],
  controllers: [AppController],
  providers: [AppService, YGateway]
})
export class AppModule {}
