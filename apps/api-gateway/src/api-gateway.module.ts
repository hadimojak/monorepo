import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloDriver,
  ApolloDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [
        join(
          process.cwd(),
          'api-gateway/src/schema/**/*.graphql',
        ),
      ],
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({
        authorization: req.headers['authorization'] as
          | string
          | undefined,
        req,
      }),
      formatError: (err) => ({
        message: err.message,
        path: err.path,
        extensions: {
          code: err.extensions?.code ?? 'internal server error',
          origin: err.extensions ?? null,
        },
      }),
    }),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, ProductResolver],
})
export class ApiGatewayModule {}
