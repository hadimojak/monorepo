import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  await app.listen(process.env.port ?? 3002);
  console.log('auth-service start done at http://localhost:3002');
}
bootstrap();
