import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaModule } from './categoria/categoria.module';
import { MedicamentoModule } from './medicamento/medicamento.module';
import { EmpleadoModule } from './empleado/empleado.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'farmacia',
      autoLoadEntities: true,
      synchronize: true, // OJO: solo en desarrollo, crea/actualiza tablas automáticamente
    }),
    CategoriaModule,
    MedicamentoModule,
    EmpleadoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}