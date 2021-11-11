import { Pattern } from './pattern';

/**
 * Dynamic provide options.
 */
export interface DynamicProviderOptions {
  /**
   * Glob pattern for finding files.
   */
  pattern: Pattern;

  /**
   * Add providers to export in module.
   *
   * @default: false
   */
  exportProviders?: boolean;
}
