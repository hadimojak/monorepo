import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID, randomUUID } from 'crypto';

export type productEntity = {
  id: UUID;
  name: string;
  desc: string | null;
  price: number;
  createdAt: string;
  updatedAt: string | null;
};

@Injectable()
export class ProductService {
  private store = new Map<UUID, productEntity>();

  getById(id: UUID) {
    return this.store.get(id) ?? null;
  }

  create(input: { name: string; desc?: string; price: number }) {
    const now = new Date().toISOString();
    const id = randomUUID();
    const product: productEntity = {
      id,
      name: input.name,
      desc: input.desc ?? null,
      price: input.price,
      createdAt: now,
      updatedAt: null,
    };

    this.store.set(id, product);
    return product;
  }

  update(
    id: UUID,
    input: Partial<
      Omit<productEntity, 'id' | 'createdAt' | 'updatedAt'>
    >,
  ) {
    const p = this.store.get(id);
    if (!p) throw new NotFoundException('product not found');
    const updated: productEntity = {
      ...p,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, updated);
    return updated;
  }

  delete(id: UUID) {
    const ok = this.store.delete(id);
    if (!ok) throw new NotFoundException('product not found');
    return true;
  }

  list(
    page: number,
    pageSize: number,
    filter?: {
      q?: string;
      minPrice?: number;
      maxPrice?: number;
    },
  ) {
    let items = Array.from(this.store.values());

    const q = <string>filter?.q?.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLocaleLowerCase().includes(q) ||
        (p.desc ?? '').toLocaleLowerCase().includes(q),
    );
    if (filter?.minPrice != null)
      items = items.filter((p) => p.price >= filter.minPrice!);
    if (filter?.maxPrice != null)
      items = items.filter((p) => p.price <= filter.maxPrice!);

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);
    return { items: paged, total };
  }
}
