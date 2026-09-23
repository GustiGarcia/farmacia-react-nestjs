import { IsString, IsNumber, IsNotEmpty, IsPositive, IsOptional, IsDateString } from 'class-validator';

export class CreateMedicamentoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  laboratorio: string;

  @IsString()
  @IsOptional()
  descripcion?:string;

  @IsDateString()
  fechaVencimiento:string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsNumber()
  stock: number;

  categoria: { id: number };
}