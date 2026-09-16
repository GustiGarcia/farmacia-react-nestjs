import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  cargo: string;

  @Column({ unique: true })
  dni: string;
}