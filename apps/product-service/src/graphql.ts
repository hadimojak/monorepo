
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateProductInput {
    desc?: Nullable<string>;
    name: string;
    price: number;
}

export class PagingInput {
    page?: Nullable<number>;
    pageSize?: Nullable<number>;
}

export class ProductFilter {
    maxPrice?: Nullable<number>;
    minPrice?: Nullable<number>;
    q?: Nullable<string>;
}

export class UpdateProductInput {
    desc?: Nullable<string>;
    name?: Nullable<string>;
    price?: Nullable<number>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract createProduct(input: CreateProductInput): Product | Promise<Product>;

    abstract deleteProduct(id: string): boolean | Promise<boolean>;

    abstract updateProduct(id: string, input: UpdateProductInput): Product | Promise<Product>;
}

export class PaginatedProducts {
    __typename?: 'PaginatedProducts';
    items: Product[];
    page: number;
    pageSize: number;
    total: number;
}

export class Product {
    __typename?: 'Product';
    createdAt: string;
    desc: string;
    id: string;
    name: string;
    price: number;
    updatedAt?: Nullable<string>;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract product(id: string): Nullable<Product> | Promise<Nullable<Product>>;

    abstract products(filter?: Nullable<ProductFilter>, paging?: Nullable<PagingInput>): PaginatedProducts | Promise<PaginatedProducts>;
}

type Nullable<T> = T | null;
