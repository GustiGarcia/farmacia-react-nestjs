import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Entity()
export class Medicamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({nullable:true})
  descripcion:string;

  @Column()
  laboratorio: string;

  @Column({type:'date'})
  fechaVencimiento:Date;

  @Column('decimal')
  precio: number;

  @Column()
  stock: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.medicamentos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}