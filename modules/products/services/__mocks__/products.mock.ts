import { registerMock } from '@shared/api/index.ts';
import type { Product } from '../../types.ts';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: '$79.99', category: 'Electronics', stock: 142 },
  { id: '2', name: 'Ergonomic Keyboard', price: '$129.99', category: 'Electronics', stock: 85 },
  { id: '3', name: 'Standing Desk', price: '$449.99', category: 'Furniture', stock: 23 },
  { id: '4', name: 'LED Monitor 27"', price: '$349.99', category: 'Electronics', stock: 67 },
  { id: '5', name: 'Office Chair', price: '$299.99', category: 'Furniture', stock: 31 },
];

export function registerProductMocks(): void {
  registerMock('GET /products', () => ({
    data: MOCK_PRODUCTS,
    total: MOCK_PRODUCTS.length,
    page: 1,
    pageSize: 20,
  }));

  registerMock('GET /products/:id', (url) => {
    const id = url.split('/').pop();
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error(`Product ${id} not found`);
    return product;
  });

  registerMock('POST /products', (_url, init) => {
    const body = JSON.parse(init.body as string);
    return {
      id: String(MOCK_PRODUCTS.length + 1),
      ...body,
    } satisfies Product;
  });

  registerMock('PATCH /products/:id', (url, init) => {
    const id = url.split('/').pop();
    const existing = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!existing) throw new Error(`Product ${id} not found`);
    const body = JSON.parse(init.body as string);
    return { ...existing, ...body };
  });

  registerMock('DELETE /products/:id', () => undefined);
}
