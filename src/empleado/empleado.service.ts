import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from './entities/empleado.entity';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) {}

  create(createEmpleadoDto: CreateEmpleadoDto) {
    const empleado = this.empleadoRepository.create(createEmpleadoDto);
    return this.empleadoRepository.save(empleado);
  }

  findAll() {
    return this.empleadoRepository.find();
  }

  findOne(id: number) {
    return this.empleadoRepository.findOne({ where: { id } });
  }

  update(id: number, updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.empleadoRepository.update(id, updateEmpleadoDto);
  }

  remove(id: number) {
    return this.empleadoRepository.delete(id);
  }
}