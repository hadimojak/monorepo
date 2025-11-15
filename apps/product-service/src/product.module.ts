import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloDriver,
  ApolloDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // 👇 فقط فایل‌های SDL را می‌خواند (Schema-First)
      typePaths: [
        join(
          process.cwd(),
          'apps/product-service/src/**/*.graphql',
        ),
      ],
      sortSchema: true,
      playground: true,
      // اختیاری: تولید تایپ‌های TS از روی اسکیمای SDL
      definitions: {
        path: join(
          process.cwd(),
          'apps/product-service/src/graphql.ts',
        ),
        emitTypenameField: true,
        outputAs: 'class', // یا 'interface'
      },
      context: ({ req }) => ({
        authorization: req.headers['authorization'] as
          | string
          | undefined,
        req,
      }),
    }),
  ],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
