/**
 * Module-specific types.
 *
 * Keep all domain types for this module here.
 * Never import types from other modules — use @shared/types if sharing is needed.
 */

export interface __Name__ {
  id: string;
  name: string;
  // Add domain-specific fields
}

export interface Create__Name__Input {
  name: string;
  // Fields required to create a new entity
}

export type Update__Name__Input = Partial<Create__Name__Input>;
