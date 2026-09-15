import { Test, TestingModule } from '@nestjs/testing';
import { MedicamentoController } from './medicamento.controller';
import { MedicamentoService } from './medicamento.service';

describe('MedicamentoController', () => {
  let controller: MedicamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicamentoController],
      providers: [MedicamentoService],
    }).compile();

    controller = module.get<MedicamentoController>(MedicamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
