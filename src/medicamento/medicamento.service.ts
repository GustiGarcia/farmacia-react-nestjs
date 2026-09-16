import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicamento } from './entities/medicamento.entity';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Injectable()
export class MedicamentoService {
  constructor(
    @InjectRepository(Medicamento)
    private medicamentoRepository: Repository<Medicamento>,
  ) {}

  create(createMedicamentoDto: CreateMedicamentoDto) {
    const medicamento = this.medicamentoRepository.create(createMedicamentoDto);
    return this.medicamentoRepository.save(medicamento);
  }

  findAll() {
    return this.medicamentoRepository.find({ relations: { categoria: true } });
  }

  findOne(id: number) {
    return this.medicamentoRepository.findOne({
      where: { id },
      relations: { categoria: true },
    });
  }

  update(id: number, updateMedicamentoDto: UpdateMedicamentoDto) {
    return this.medicamentoRepository.update(id, updateMedicamentoDto);
  }

  remove(id: number) {
    return this.medicamentoRepository.delete(id);
  }
}