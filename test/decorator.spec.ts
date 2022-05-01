import {
  InjectDynamicProviders,
  IsObject,
  resolveDynamicProviders,
} from '../src';
import { Module, ModuleMetadata, Scope, Type } from '@nestjs/common';
import {
  Cat,
  COMMAND_METADATA,
  Dog,
  Hippo,
  Lion,
  PlayCommand,
  Veterinarian,
} from './__fixture__';
import { ClassProvider } from '@nestjs/common/interfaces/modules/provider.interface';

describe('Dynamic module', () => {
  it('should set only injectable providers into module', async () => {
    @InjectDynamicProviders('test/__fixture__/**/*.wild.ts')
    @Module({})
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', AnimalModule);
    const expectResult = [Hippo, Lion];

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should concat providers in module', async () => {
    @InjectDynamicProviders('test/__fixture__/**/*.wild.ts')
    @Module({ providers: [Veterinarian] })
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', AnimalModule);
    const expectResult = [Veterinarian, Hippo, Lion];

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should find by two patterns', async () => {
    @InjectDynamicProviders(
      'test/__fixture__/**/*.wild.ts',
      'test/__fixture__/**/*.pet.ts',
    )
    @Module({ providers: [Veterinarian] })
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', AnimalModule);
    const expectResult = [Veterinarian, Hippo, Lion, Cat, Dog];

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should add providers and set exported providers to exports into module', async () => {
    @InjectDynamicProviders(
      {
        pattern: 'test/__fixture__/**/*.wild.ts',
        exportProviders: true,
      },
      { pattern: 'test/__fixture__/**/*.pet.ts' },
    )
    @Module({ providers: [Veterinarian] })
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult: ModuleMetadata = {
      providers: Reflect.getMetadata('providers', AnimalModule),
      exports: Reflect.getMetadata('exports', AnimalModule),
    };
    const expectResult: ModuleMetadata = {
      providers: [Veterinarian, Hippo, Lion, Cat, Dog],
      exports: [Hippo, Lion],
    };

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should replace default filter predicate', async () => {
    @InjectDynamicProviders({
      pattern: 'test/__fixture__/**/*.command.ts',
      filterPredicate: (type: Type) =>
        IsObject(type) && Reflect.hasOwnMetadata(COMMAND_METADATA, type),
    })
    @Module({})
    class CommandModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', CommandModule);
    const expectResult = [PlayCommand];

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should register providers with scope', async () => {
    @InjectDynamicProviders({
      pattern: 'test/__fixture__/**/*.wild.ts',
      scope: Scope.TRANSIENT,
    })
    @Module({})
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', AnimalModule);
    const expectResult: ClassProvider[] = [
      {
        provide: Hippo,
        useClass: Hippo,
        scope: Scope.TRANSIENT,
      },
      {
        provide: Lion,
        useClass: Lion,
        scope: Scope.TRANSIENT,
      },
    ];

    expect(actualResult).toStrictEqual(expectResult);
  });
});
