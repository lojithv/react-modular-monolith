import type { ComponentType } from 'react';

export interface UIExample {
  /** Unique slug used for anchor links */
  id: string;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** The example component to render */
  component: ComponentType;
}

/**
 * Central registry of all UI examples.
 * To add a new example, create a file in shared/ui/examples/ and append it here.
 */
export const exampleRegistry: UIExample[] = [];

/** Register one or more examples — call from each example file's side-effect import */
export function registerExamples(...examples: UIExample[]) {
  exampleRegistry.push(...examples);
}
