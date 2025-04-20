import { Test, TestingModule } from '@nestjs/testing';
import { YGateway } from './y.gateway';

describe('YGateway', () => {
  let gateway: YGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YGateway],
    }).compile();

    gateway = module.get<YGateway>(YGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
