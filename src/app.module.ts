import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicamentoModule } from './medicamento/medicamento.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { VentaModule } from './venta/venta.module';

@Module({
  imports: [MedicamentoModule, EmpleadoModule, VentaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
