import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Entity()
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  laboratorio: string;

  @Column('decimal')
  precio: number;

  @Column()
  stock: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.medicamentos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}