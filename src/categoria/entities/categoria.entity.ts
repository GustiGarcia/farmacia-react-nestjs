import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medicamento } from '../../medicamento/entities/medicamento.entity';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @OneToMany(() => Medicamento, (medicamento) => medicamento.categoria)
  medicamentos: Medicamento[];
}