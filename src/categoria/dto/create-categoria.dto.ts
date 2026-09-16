import { IsString, IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMedicamentoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  laboratorio: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsNumber()
  stock: number;

  categoria: { id: number };
}