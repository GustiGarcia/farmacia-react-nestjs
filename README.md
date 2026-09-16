# Farmacia - Backend (API REST)

API REST para la gestión de una farmacia, desarrollada con **NestJS**, **TypeORM** y **PostgreSQL**. Permite administrar categorías, medicamentos y empleados.

Trabajo práctico de **Programación 3** — IES 9-023.

## Autores

- **Gustavo García**
- **Nahuel Ghilardi Salinas**

## Tecnologías

- [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- class-validator / class-transformer (validación de datos)

## Requisitos previos

- Node.js **22.13 o superior** (versiones anteriores dan error de compatibilidad con ESLint)
- Yarn
- PostgreSQL instalado y en ejecución

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd farmacia-programacion
   ```

2. Instalar dependencias:

   ```bash
   yarn install
   ```

3. Crear la base de datos en PostgreSQL:

   ```sql
   CREATE DATABASE farmacia;
   ```

4. Configurar la conexión en `src/app.module.ts` con tu usuario y contraseña de PostgreSQL:

   ```typescript
   TypeOrmModule.forRoot({
     type: 'postgres',
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'tu_password',
     database: 'farmacia',
     autoLoadEntities: true,
     synchronize: true,
   }),
   ```

   > `synchronize: true` crea y actualiza las tablas automáticamente. Usarlo solo en desarrollo.

## Ejecución

```bash
# modo desarrollo (se reinicia al guardar cambios)
yarn start:dev

# modo normal
yarn start
```

La API queda disponible en `http://localhost:3000`.

## Entidades

| Entidad         | Campos                                                       | Relación                         |
| --------------- | ------------------------------------------------------------ | -------------------------------- |
| **Categoria**   | id, nombre, descripcion (opcional)                           | Una categoría tiene muchos medicamentos |
| **Medicamento** | id, nombre, laboratorio, precio, stock, categoria            | Cada medicamento pertenece a una categoría |
| **Empleado**    | id, nombre, apellido, cargo, dni (único)                     | Sin relaciones                   |

## Endpoints

Cada entidad tiene un CRUD completo:

| Método | Ruta                  | Descripción              |
| ------ | --------------------- | ------------------------ |
| GET    | `/categoria`          | Listar categorías        |
| GET    | `/categoria/:id`      | Obtener una categoría    |
| POST   | `/categoria`          | Crear categoría          |
| PATCH  | `/categoria/:id`      | Actualizar categoría     |
| DELETE | `/categoria/:id`      | Eliminar categoría       |
| GET    | `/medicamento`        | Listar medicamentos (incluye su categoría) |
| GET    | `/medicamento/:id`    | Obtener un medicamento   |
| POST   | `/medicamento`        | Crear medicamento        |
| PATCH  | `/medicamento/:id`    | Actualizar medicamento   |
| DELETE | `/medicamento/:id`    | Eliminar medicamento     |
| GET    | `/empleado`           | Listar empleados         |
| GET    | `/empleado/:id`       | Obtener un empleado      |
| POST   | `/empleado`           | Crear empleado           |
| PATCH  | `/empleado/:id`       | Actualizar empleado      |
| DELETE | `/empleado/:id`       | Eliminar empleado        |

## Ejemplos de uso

Crear una categoría (`POST /categoria`):

```json
{ "nombre": "Analgésicos", "descripcion": "Para el dolor y la fiebre" }
```

Crear un medicamento (`POST /medicamento`), indicando el `id` de una categoría existente:

```json
{
  "nombre": "Ibuprofeno 600mg",
  "laboratorio": "Bagó",
  "precio": 1500,
  "stock": 100,
  "categoria": { "id": 1 }
}
```

Crear un empleado (`POST /empleado`):

```json
{ "nombre": "Juan", "apellido": "Pérez", "cargo": "Farmacéutico", "dni": "30123456" }
```

## Notas

- **Validaciones:** los datos de entrada se validan con `ValidationPipe`. Si falta un campo obligatorio o un valor no es válido (por ejemplo, un precio negativo), la API responde con error 400.
- **Precio:** al leer medicamentos, el campo `precio` llega como texto (por ejemplo `"1500.00"`), porque PostgreSQL devuelve las columnas `decimal` como string. Al crear o actualizar, debe enviarse como número.
- **CORS:** habilitado para `http://localhost:5173`, el puerto por defecto del frontend con Vite.

## Estructura del proyecto

```
src/
├── categoria/
│   ├── dto/
│   ├── entities/
│   ├── categoria.controller.ts
│   ├── categoria.module.ts
│   └── categoria.service.ts
├── medicamento/
│   └── (misma estructura)
├── empleado/
│   └── (misma estructura)
├── app.module.ts
└── main.ts
```