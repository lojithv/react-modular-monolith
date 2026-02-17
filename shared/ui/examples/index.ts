/**
 * Example loader — importing this file registers all examples into the registry.
 * To add a new example: create a folder in examples/<component>/, then import it below.
 */
import './button/index.tsx';
import './input/index.tsx';
import './select/index.tsx';
import './badge/index.tsx';
import './card/index.tsx';
import './modal/index.tsx';
import './composition/index.tsx';

export { exampleRegistry, type UIExample } from './registry.ts';
