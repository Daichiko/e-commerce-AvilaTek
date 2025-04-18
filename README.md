# 🛒 API REST - Sistema de Comercio Electrónico

Este proyecto es una **API RESTful** desarrollada con **Node.js**, **Express**, **TypeScript** y **Prisma**, utilizando **PostgreSQL** como sistema de base de datos. Su objetivo es gestionar un sistema de comercio electrónico, cubriendo funcionalidades como autenticación, control de usuarios, gestión de roles, productos y órdenes de compra.

---

## ⚙️ Tecnologías y herramientas utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express**: Framework web minimalista para Node.js.
- **TypeScript**: Superset de JavaScript que añade tipado estático.
- **Prisma ORM**: Mapeador objeto-relacional para manejar la base de datos.
- **PostgreSQL**: Sistema de base de datos relacional.
- **JWT**: JSON Web Tokens para autenticación y autorización.
- **bcrypt**: Librería para el hasheo de contraseñas.
- **dotenv**: Gestión de variables de entorno.
- **ts-node-dev**: Recarga automática del servidor en desarrollo.
- **class-validator** y **class-transformer**: Validación y transformación de DTOs.

---

## 🚀 Despliegue en entorno de desarrollo

### 1. Clona el repositorio

```bash
git clone https://github.com/Daichiko/e-commerce-AvilaTek.git
cd e-commerce-AvilaTek
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura las variables de entorno
```env
DATABASE_URL = "postgresql://postgres:123456@localhost:5432/e-commerce"
JWT_PASS = "clave_super_secreta"
```

### 4. Ejecuta las migraciones y la precarga de datos
```bash
npm run migrate:dev
```
Este comando:
  - Aplica las migraciones (estructura de base de datos).
  - Ejecuta el archivo prisma/seed.ts para crear los roles y un usuario admin.

### 5. Levanta el servidor en modo desarrollo
```bash
npm run dev
```
El servidor quedará disponible por defecto en: http://localhost:3000
