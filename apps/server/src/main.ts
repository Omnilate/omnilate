import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { OpenAPIObject } from '@nestjs/swagger'

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
  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
