import { registerMock } from '@shared/api/index.ts';
import type { User } from '../../types.ts';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joinedAt: '2026-01-15', lastLoginAt: '2026-02-17' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', joinedAt: '2026-01-20', lastLoginAt: '2026-02-16' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive', joinedAt: '2025-11-05', lastLoginAt: '2026-01-10' },
  { id: '4', name: 'Diana Lee', email: 'diana@example.com', role: 'Editor', status: 'Active', joinedAt: '2026-02-01', lastLoginAt: '2026-02-17' },
  { id: '5', name: 'Ethan Brown', email: 'ethan@example.com', role: 'Admin', status: 'Active', joinedAt: '2025-08-15', lastLoginAt: '2026-02-15' },
];

export function registerUserMocks(): void {
  registerMock('GET /users', () => ({
    data: MOCK_USERS,
    total: MOCK_USERS.length,
    page: 1,
    pageSize: 20,
  }));

  registerMock('GET /users/:id', (url) => {
    const id = url.split('/').pop();
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) throw new Error(`User ${id} not found`);
    return user;
  });
}
