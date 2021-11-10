import { InjectDynamicProviders, resolveDynamicProviders } from '../src';
import { Module, ModuleMetadata } from '@nestjs/common';
import { Veterinarian, Hippo, Lion, Cat, Dog } from './__fixture__';

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
});
