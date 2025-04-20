import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { OpenAPIObject } from '@nestjs/swagger'
import { WsAdapter } from '@nestjs/platform-ws'
import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Omnilate API Documentation')
    .setDescription('API documentation for Omnilate')
    .setVersion('1.0.0-alpha.0')
    .addBearerAuth()
    .build()

  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, documentFactory)

  app.useWebSocketAdapter(new WsAdapter(app))
  app.use(cookieParser())

  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
