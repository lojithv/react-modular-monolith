import { registerMock } from '@shared/api/index.ts';
import type { __Name__ } from '../../types.ts';

/**
 * Mock data for development and testing.
 * Registered at app startup when VITE_API_MOCK=true.
 */

const MOCK___NAME__S: __Name__[] = [
  { id: '1', name: 'Example Item 1' },
  { id: '2', name: 'Example Item 2' },
  { id: '3', name: 'Example Item 3' },
];

export function register__Name__Mocks(): void {
  registerMock('GET /__name__s', () => ({
    data: MOCK___NAME__S,
    total: MOCK___NAME__S.length,
    page: 1,
    pageSize: 20,
  }));

  registerMock('GET /__name__s/:id', (url) => {
    const id = url.split('/').pop();
    const item = MOCK___NAME__S.find((i) => i.id === id);
    if (!item) throw new Error(`__Name__ ${id} not found`);
    return item;
  });

  registerMock('POST /__name__s', (_url, init) => {
    const body = JSON.parse(init.body as string);
    return {
      id: String(MOCK___NAME__S.length + 1),
      ...body,
    } satisfies __Name__;
  });

  registerMock('PATCH /__name__s/:id', (url, init) => {
    const id = url.split('/').pop();
    const existing = MOCK___NAME__S.find((i) => i.id === id);
    if (!existing) throw new Error(`__Name__ ${id} not found`);
    const body = JSON.parse(init.body as string);
    return { ...existing, ...body };
  });

  registerMock('DELETE /__name__s/:id', () => undefined);
}
