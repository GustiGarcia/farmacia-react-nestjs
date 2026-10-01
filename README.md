# Farmacia - Backend (API REST)

API REST para la gestión de una farmacia, desarrollada con **NestJS**, **TypeORM** y **MySQL** (ejecutándose en un contenedor **Docker**). Permite administrar categorías, medicamentos y empleados, con **autenticación de usuarios** mediante JWT.

Trabajo práctico de **Programación 3** — IES 9-023.

## Autores

- **Gustavo García**
- **Nahuel Ghilardi Salinas**

## Tecnologías

- [NestJS](https://nestjs.com/) (Node.js + TypeScript)
- [TypeORM](https://typeorm.io/)
- [MySQL 8](https://www.mysql.com/) (vía Docker Compose)
- [Docker](https://www.docker.com/) / Docker Compose
- class-validator / class-transformer (validación de datos)
- @nestjs/jwt + Passport + bcrypt (autenticación)

## Requisitos previos

- Node.js **22.13 o superior**
- Yarn
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución

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

3. Levantar la base de datos MySQL con Docker Compose (el archivo `docker-compose.yml` ya está en la raíz del proyecto):

   ```bash
   docker compose up -d
   ```

   Esto descarga la imagen de MySQL 8 (la primera vez) y levanta un contenedor llamado `farmacia-mysql`, con la base `farmacia` creada automáticamente. Los datos persisten en un volumen de Docker, así que sobreviven a reinicios del contenedor.

   Para confirmar que quedó arriba:

   ```bash
   docker ps
   ```

   Debería aparecer `farmacia-mysql` con estado `Up`.

   > Si el puerto `3306` ya está en uso en tu máquina (por ejemplo, por un MySQL instalado localmente), el `docker-compose.yml` lo mapea al puerto `3307`. Ajustá el puerto en `app.module.ts` según corresponda en tu entorno.

4. La conexión a la base ya está configurada en `src/app.module.ts`:

   ```typescript
   TypeOrmModule.forRoot({
     type: 'mysql',
     host: 'localhost',
     port: 3307,
     username: 'root',
     password: 'root',
     database: 'farmacia',
     autoLoadEntities: true,
     synchronize: true,
   }),
   ```

   > `synchronize: true` crea y actualiza las tablas automáticamente a partir de las entidades. Usarlo solo en desarrollo.

## Ejecución

```bash
# modo desarrollo (se reinicia al guardar cambios)
yarn start:dev

# modo normal
yarn start
```

La API queda disponible en `http://localhost:3000`.

> El contenedor de MySQL debe estar corriendo (`docker compose up -d`) antes de levantar el backend.

## Autenticación

La API usa autenticación con **JWT**. Las contraseñas se guardan hasheadas con **bcrypt** (nunca en texto plano).

- **Registrarse:** `POST /auth/register` con `{ email, password }` crea un usuario.
- **Iniciar sesión:** `POST /auth/login` con `{ email, password }` devuelve un token: `{ "access_token": "..." }`.
- **Rutas protegidas:** todos los endpoints de medicamentos, categorías y empleados requieren enviar el token en la cabecera `Authorization: Bearer <token>`. Sin token válido responden **401 Unauthorized**.
- Los endpoints de `/auth` (login y register) son públicos.

El token vence en 1 día. La clave de firma está definida en el módulo de autenticación (en un proyecto real debería ir en una variable de entorno).

## Entidades

| Entidad         | Campos                                                                                       | Relación                                   |
| --------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Usuario**     | id, email (único), password (hasheada)                                                        | Sin relaciones                              |
| **Categoria**   | id, nombre, descripcion (opcional)                                                            | Una categoría tiene muchos medicamentos     |
| **Medicamento** | id, nombre, descripcion (opcional), laboratorio, fechaVencimiento, precio, stock, categoria   | Cada medicamento pertenece a una categoría  |
| **Empleado**    | id, nombre, apellido, email (único), telefono, cargo, dni (único), fechaIngreso              | Sin relaciones                              |

## Endpoints

### Autenticación (públicos)

| Método | Ruta             | Descripción                        | Respuesta |
| ------ | ---------------- | ---------------------------------- | --------- |
| POST   | `/auth/register` | Crear usuario                      | 201 |
| POST   | `/auth/login`    | Iniciar sesión (devuelve el token) | 201 |

### Recursos (requieren token)

Cada entidad tiene un CRUD completo:

| Método | Ruta                | Descripción                                | Respuesta exitosa |
| ------ | ------------------- | ------------------------------------------- | ------------------ |
| GET    | `/categoria`        | Listar categorías                          | 200 |
| GET    | `/categoria/:id`    | Obtener una categoría                      | 200 |
| POST   | `/categoria`        | Crear categoría                            | 201 |
| PATCH  | `/categoria/:id`    | Actualizar categoría                       | 200 |
| DELETE | `/categoria/:id`    | Eliminar categoría                         | 200 |
| GET    | `/medicamento`      | Listar medicamentos (incluye su categoría) | 200 |
| GET    | `/medicamento/:id`  | Obtener un medicamento                     | 200 |
| POST   | `/medicamento`      | Crear medicamento                          | 201 |
| PATCH  | `/medicamento/:id`  | Actualizar medicamento                     | 200 |
| DELETE | `/medicamento/:id`  | Eliminar medicamento                       | 200 |
| GET    | `/empleado`         | Listar empleados                           | 200 |
| GET    | `/empleado/:id`     | Obtener un empleado                        | 200 |
| POST   | `/empleado`         | Crear empleado                             | 201 |
| PATCH  | `/empleado/:id`     | Actualizar empleado                        | 200 |
| DELETE | `/empleado/:id`     | Eliminar empleado                          | 200 |

Ante datos inválidos (campo obligatorio faltante, formato incorrecto, valor negativo donde no corresponde), cualquier `POST` o `PATCH` responde **400 Bad Request** con el detalle del error.

## Ejemplos de uso

Crear un usuario (`POST /auth/register`):

```json
{ "email": "admin@farmacia.com", "password": "1234" }
```

Iniciar sesión (`POST /auth/login`) → devuelve el token a usar en las demás peticiones:

```json
{ "email": "admin@farmacia.com", "password": "1234" }
```

Crear una categoría (`POST /categoria`, con el token en la cabecera):

```json
{ "nombre": "Analgésicos", "descripcion": "Para el dolor y la fiebre" }
```

Crear un medicamento (`POST /medicamento`), indicando el `id` de una categoría existente:

```json
{
  "nombre": "Ibuprofeno 600mg",
  "descripcion": "Antiinflamatorio no esteroideo",
  "laboratorio": "Bagó",
  "fechaVencimiento": "2027-05-31",
  "precio": 1500,
  "stock": 100,
  "categoria": { "id": 1 }
}
```

Crear un empleado (`POST /empleado`):

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@farmacia.com",
  "telefono": "2615551234",
  "cargo": "Farmacéutico",
  "dni": "30123456",
  "fechaIngreso": "2024-03-01"
}
```

## Notas

- **Validaciones:** los datos de entrada se validan con `ValidationPipe` (requiere `class-validator` y `class-transformer`). Si falta un campo obligatorio o un valor no es válido, la API responde 400.
- **Contraseñas:** se guardan hasheadas con bcrypt. En la tabla `usuario` nunca se ve la contraseña en texto plano, sino un hash tipo `$2b$10$...`.
- **Precio:** al leer medicamentos, el campo `precio` llega como texto (por ejemplo `"1500.00"`), porque la columna `decimal` se devuelve como string. Al crear o actualizar, debe enviarse como número.
- **Fechas:** `fechaVencimiento` y `fechaIngreso` se envían y devuelven como texto en formato ISO (`"2027-05-31"`), aunque en la base se almacenan como columnas de tipo `date`.
- **Teléfono y DNI:** se almacenan como texto (`string`), no como número, para no perder ceros a la izquierda ni símbolos como `+`.
- **CORS:** habilitado para `http://localhost:5173`, el puerto por defecto del frontend con Vite.

## Base de datos con Docker

El archivo `docker-compose.yml` en la raíz del proyecto define el servicio de MySQL:

```yaml
services:
  mysql:
    image: mysql:8
    container_name: farmacia-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: farmacia
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Comandos útiles:

```bash
docker compose up -d      # levantar la base de datos
docker compose down       # apagar el contenedor (los datos persisten en el volumen)
docker compose logs -f    # ver los logs de MySQL en vivo
docker exec -it farmacia-mysql mysql -u root -p   # entrar a la consola de MySQL
```

## Estructura del proyecto

```
docker-compose.yml
src/
├── auth/                  # autenticación (login, register, JWT, guard)
│   ├── dto/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── usuario/
│   └── entities/
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
