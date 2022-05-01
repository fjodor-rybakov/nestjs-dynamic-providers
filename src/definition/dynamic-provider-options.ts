import { Pattern } from './pattern';
import { Scope, Type } from '@nestjs/common';

/**
 * Dynamic provide options.
 */
export interface DynamicProviderOptions {
  /**
   * Glob pattern for finding files.
   */
  pattern: Pattern;

  /**
   * Specifies the lifetime of an injected Provider
   */
  scope?: Scope;

  /**
   * Add providers to export in module.
   *
   * @default: false
   */
  exportProviders?: boolean;

  /**
   * Custom filter for module file
   */
  filterPredicate?: (types: Type) => boolean;
}
