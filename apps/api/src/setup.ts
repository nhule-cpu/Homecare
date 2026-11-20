import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/** Cấu hình dùng chung cho main.ts và e2e test. */
export function setupApp(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Axel Homecare API')
    .setDescription('API công cụ điều phối zone - Axel Homecare')
    .setVersion('0.0.0')
    .build();
  SwaggerModule.setup('docs', app, () => SwaggerModule.createDocument(app, config));
}
