import { Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InjectDynamicProviderModule } from '../src';
import { Cat, Dog, Hippo, Lion, Veterinarian } from './__fixture__';

describe('Dynamic module', () => {
  it('should set only injectable providers into module', async () => {
    @Module({
      imports: [
        InjectDynamicProviderModule.forFeature('test/__fixture__/**/*.wild.ts'),
      ],
    })
    class AnimalModule {}

    const moduleFixture = await Test.createTestingModule({
      imports: [AnimalModule],
    }).compile();

    expect(moduleFixture.get(Hippo)).toBeDefined();
    expect(moduleFixture.get(Lion)).toBeDefined();
  });

  it('should concat providers in module', async () => {
    @Module({
      imports: [
        InjectDynamicProviderModule.forFeature('test/__fixture__/**/*.wild.ts'),
      ],
      providers: [Veterinarian],
    })
    class AnimalModule {}

    const moduleFixture = await Test.createTestingModule({
      imports: [AnimalModule],
    }).compile();

    expect(moduleFixture.get(Hippo)).toBeDefined();
    expect(moduleFixture.get(Lion)).toBeDefined();
    expect(moduleFixture.get(Veterinarian)).toBeDefined();
  });

  it('should find by two patterns', async () => {
    @Module({
      imports: [
        InjectDynamicProviderModule.forFeature(
          'test/__fixture__/**/*.wild.ts',
          'test/__fixture__/**/*.pet.ts',
        ),
      ],
    })
    class AnimalModule {}

    const moduleFixture = await Test.createTestingModule({
      imports: [AnimalModule],
    }).compile();

    expect(moduleFixture.get(Hippo)).toBeDefined();
    expect(moduleFixture.get(Lion)).toBeDefined();
    expect(moduleFixture.get(Cat)).toBeDefined();
    expect(moduleFixture.get(Dog)).toBeDefined();
  });

  it('should add providers and set exported providers to exports into module', async () => {
    @Module({
      imports: [
        InjectDynamicProviderModule.forFeature(
          'test/__fixture__/**/*.wild.ts',
          'test/__fixture__/**/*.pet.ts',
        ),
      ],
      providers: [Veterinarian],
      exports: [InjectDynamicProviderModule],
    })
    class AnimalModule {}

    const moduleFixture = await Test.createTestingModule({
      imports: [AnimalModule],
    }).compile();

    expect(moduleFixture.get(Veterinarian)).toBeDefined();
    expect(moduleFixture.get(Hippo)).toBeDefined();
    expect(moduleFixture.get(Lion)).toBeDefined();
    expect(moduleFixture.get(Cat)).toBeDefined();
    expect(moduleFixture.get(Dog)).toBeDefined();
  });
});
