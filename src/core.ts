import { Type } from '@nestjs/common';
import { glob } from 'glob';

interface StoreValue {
  target: Function;
  options: DynamicProviderOptions[];
}

type ResolvedTypeProviders = {
  types: Type[];
} & Omit<DynamicProviderOptions, 'pattern'>;

const store: StoreValue[] = [];

/**
 * Glob pattern.
 */
export type Pattern = string;

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

/**
 * Add providers into module by glob pattern.
 */
export function InjectDynamicProviders(
  ...options: DynamicProviderOptions[]
): ClassDecorator;
export function InjectDynamicProviders(...patterns: Pattern[]): ClassDecorator;
export function InjectDynamicProviders(...options: any[]): ClassDecorator {
  return <TFunction extends Function>(target: TFunction): TFunction => {
    if (isDynamicProviderOptions(options)) store.push({ target, options });
    if (isPattern(options))
      store.push({ target, options: options.map((pattern) => ({ pattern })) });

    return target;
  };
}

/**
 * Init function.
 */
export async function resolveDynamicProviders(): Promise<void> {
  await Promise.all(
    store.map(async ({ target, options }) => {
      const resolvedProviders = await resolveByGlobPattern(options);

      resolvedProviders.forEach(({ types, exportProviders }) => {
        mergeProviders(target, types);
        if (exportProviders) {
          mergeExportedProviders(target, types);
        }
      });
    }),
  );
}

function mergeProviders(target: Function, types: Type[]): void {
  const currentProviders = Reflect.getMetadata('providers', target) ?? [];
  Reflect.defineMetadata('providers', [...currentProviders, ...types], target);
}

function mergeExportedProviders(target: Function, types: Type[]): void {
  const currentExportedProviders = Reflect.getMetadata('exports', target) ?? [];
  Reflect.defineMetadata(
    'exports',
    [...currentExportedProviders, ...types],
    target,
  );
}

function getClasses(pathToFiles: string[]): Promise<Type[]> {
  return Promise.all(
    pathToFiles.map(async (pathToFile: string) => {
      const path = await import('path');
      const resolvedPath = path.resolve(process.cwd(), pathToFile);
      const resolvedClass = await import(resolvedPath);

      return Object.values<Type>(resolvedClass)[0];
    }),
  );
}

async function resolveByGlobPattern(
  options: DynamicProviderOptions[],
): Promise<ResolvedTypeProviders[]> {
  const classesList = await Promise.all(
    options.map(
      ({ pattern, exportProviders }) =>
        new Promise<ResolvedTypeProviders>((resolve, reject) =>
          glob(pattern, async (err, pathToFiles) => {
            if (err) return reject(err);

            const types = await getClasses(pathToFiles);

            return resolve({ types, exportProviders });
          }),
        ),
    ),
  );

  return classesList.flat();
}

function isDynamicProviderOptions(
  param: any[],
): param is DynamicProviderOptions[] {
  return typeof param[0] === 'object';
}

function isPattern(param: any[]): param is Pattern[] {
  return typeof param[0] === 'string';
}
