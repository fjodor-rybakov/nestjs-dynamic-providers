import { DynamicProviderOptions } from '../definition/dynamic-provider-options';
import { ResolvedTypeProviders } from '../definition/resolved-type-providers';
import { SCOPE_OPTIONS_METADATA } from '@nestjs/common/constants';
import { Type } from '@nestjs/common';
import { glob } from 'glob';

export class ResolveFileService {
  async resolveByGlobPattern(
    options: DynamicProviderOptions[],
  ): Promise<ResolvedTypeProviders[]> {
    const classesList = await Promise.all(
      options.map(
        ({ pattern, exportProviders, filterPredicate }) =>
          new Promise<ResolvedTypeProviders>((resolve, reject) =>
            glob(pattern, async (err, pathToFiles) => {
              if (err) return reject(err);

              const types = (await this.getClasses(pathToFiles)).flat();

              if (!filterPredicate)
                filterPredicate = (type) =>
                  Reflect.hasOwnMetadata(SCOPE_OPTIONS_METADATA, type);

              return resolve({
                types: types.filter(filterPredicate),
                exportProviders,
              });
            }),
          ),
      ),
    );

    return classesList.flat();
  }

  private getClasses(pathToFiles: string[]): Promise<Type[][]> {
    return Promise.all(
      pathToFiles.map(async (pathToFile: string) => {
        const path = await import('path');
        const resolvedPath = path.resolve(process.cwd(), pathToFile);
        const resolvedClass = await import(resolvedPath);

        return Object.values<Type>(resolvedClass);
      }),
    );
  }
}
