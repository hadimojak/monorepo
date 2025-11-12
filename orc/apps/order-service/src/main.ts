import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  await app.listen(process.env.port ?? 3003);
  console.log('auth-service start done at http://localhost:3003');
}
bootstrap();
