import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ProductService } from './product.service';
import type { UUID } from 'crypto';

@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query('product')
  product(
    @Args('id') id: UUID,
    @Context('authorization') _auth?: string,
  ) {
    console.log(_auth);
    
    return this.productService.getById(id);
  }

  @Query('products')
  products(
    @Args('paging')
    paging?: { page?: number; pageSize?: number },
    @Args('filter')
    filter?: {
      q?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    @Context('authorization') _auth?: string,
  ) {
    const page = paging?.page ?? 1;
    const pageSize = paging?.pageSize ?? 10;
    const { items, total } = this.productService.list(
      page,
      pageSize,
      filter,
    );
    return { items, total, page, pageSize };
  }

  // ---- Mutations ----
  @Mutation('createProduct')
  createProduct(
    @Args('input') input: any,
    @Context('authorization') _auth?: string,
  ) {
    return this.productService.create(input);
  }

  @Mutation('updateProduct')
  updateProduct(
    @Args('id') id: UUID,
    @Args('input') input: any,
    @Context('authorization') _auth?: string,
  ) {
    return this.productService.update(id, input);
  }

  @Mutation('deleteProduct')
  deleteProduct(
    @Args('id') id: UUID,
    @Context('authorization') _auth?: string,
  ) {
    return this.productService.delete(id);
  }
}
