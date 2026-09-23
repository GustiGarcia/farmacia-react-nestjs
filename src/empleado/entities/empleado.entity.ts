import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({unique:true})
  email: string;

  @Column()
  telefono: string;

  @Column()
  cargo: string;

  @Column({ unique: true })
  dni: string;

  @Column({type:'date'})
  fechaIngreso: Date;
}
