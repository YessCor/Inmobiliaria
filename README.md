# 🏠 Sistema Inmobiliario

> Plataforma completa para la gestión de lotes, compras y pagos en una inmobiliaria moderna.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

Sistema web integral para la administración de una inmobiliaria, permitiendo la gestión de lotes, compras, pagos, usuarios y PQRS. Construido con tecnologías modernas y las mejores prácticas de desarrollo.

## ✨ Características Principales

### 👥 Para Clientes

| Característica | Descripción |
|----------------|-------------|
| 🔐 **Autenticación** | Registro seguro con verificación de email |
| 🗺️ **Exploración** | Navegación de lotes disponibles con filtros |
| 📋 **Reservas** | Reserva de lotes de forma online |
| 💳 **Compras** | Seguimiento completo de compras |
| 💰 **Pagos** | Gestión de cuota inicial y cuotas mensuales |
| 📬 **PQRS** | Peticiones, Quejas, Reclamos y Sugerencias |
| 👤 **Perfil** | Gestión de información personal |

### ⚙️ Para Administradores

| Característica | Descripción |
|----------------|-------------|
| 📊 **Dashboard** | Estadísticas en tiempo real |
| 👥 **Usuarios** | Crear, editar, eliminar usuarios |
| 🗂️ **Lotes** | Gestión completa de inventario |
| 📐 **Etapas** | Activar/desactivar fases del proyecto |
| 🏗️ **Planos** | Catálogo de planos de vivienda |
| 🤝 **Compras** | Aprobación y gestión de ventas |
| 💵 **Pagos** | Aprobar o rechazar pagos |
| 📝 **PQRS** | Responder consultas de clientes |

---

## 🛠️ Tecnologías

<div align="center">

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS 4 |
| **Componentes** | Radix UI + shadcn/ui |
| **Base de Datos** | PostgreSQL (Neon Serverless) |
| **Autenticación** | JWT (jose) |
| **Email** | Resend API |
| **Formularios** | React Hook Form + Zod |
| **Iconos** | Lucide React |

</div>

---

## 📁 Estructura del Proyecto

```
Inmobiliaria/
├── app/                          # Next.js App Router
│   ├── admin/                   # Panel de administración
│   │   ├── compras/            # Gestión de compras
│   │   ├── etapas/             # Gestión de etapas
│   │   ├── lotes/              # Gestión de lotes
│   │   ├── pagos/              # Gestión de pagos
│   │   ├── planos/             # Gestión de planos
│   │   ├── pqrs/               # Gestión de PQRS
│   │   └── usuarios/           # Gestión de usuarios
│   ├── dashboard/              # Panel del cliente
│   │   ├── compras/            # Mis compras
│   │   ├── etapas/             # Ver etapas
│   │   ├── lotes/              # Explorar lotes
│   │   ├── pagos/              # Mis pagos
│   │   ├── perfil/             # Mi perfil
│   │   └── pqrs/               # Mis PQRS
│   ├── login/                  # Inicio de sesión
│   ├── registro/               # Registro
│   ├── recuperar/              # Recuperar contraseña
│   └── verificar/              # Verificar email
├── components/
│   ├── admin/                  # Componentes del admin
│   ├── auth/                   # Componentes de auth
│   ├── dashboard/              # Componentes del cliente
│   ├── landing/                # Landing público
│   └── ui/                     # UI de shadcn
├── lib/
│   ├── actions/                # Server Actions
│   ├── auth.ts                 # Sesiones JWT
│   ├── db.ts                   # Conexión BD
│   ├── email.ts                # Envío de emails
│   └── format.ts               # Utilidades
├── scripts/                    # SQL scripts
└── public/                     # Archivos estáticos
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Inmobiliaria
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env`:

```env
# Base de datos Neon
DATABASE_URL="postgresql://..."

# Clave JWT (cambiar en producción)
JWT_SECRET="tu-clave-secreta-aqui"

# API de Resend
RESEND_API_KEY="re_..."

# Email remitente
FROM_EMAIL="Inmobiliaria <tu-email@tu-dominio.com>"
```

### 4. Ejecutar scripts de base de datos

```bash
# Crear tablas
psql $DATABASE_URL -f scripts/001-create-tables.sql

# Datos iniciales
psql $DATABASE_URL -f scripts/002-seed-data.sql

# Scripts adicionales
psql $DATABASE_URL -f scripts/003-add-lote-fields.sql
psql $DATABASE_URL -f scripts/004-add-verification-columns.sql
psql $DATABASE_URL -f scripts/005-add-pagos-tipo.sql
psql $DATABASE_URL -f scripts/006-add-planos-fields-and-lote-planoid.sql
```

### 5. Iniciar el servidor

```bash
pnpm dev
```

🌐 **Aplicación**: `http://localhost:3000`

---

## 👤 Datos de Prueba

### Administrador

| Campo | Valor |
|-------|-------|
| 📧 Email | `admin@inmobiliaria.com` |
| 🔑 Contraseña | `Admin123!` |

### Cliente

Regístrate en `/registro` para crear un nuevo usuario cliente.

---

## 🧭 Rutas de la Aplicación

### 🌐 Públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page principal |
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuario |
| `/recuperar` | Recuperar contraseña |
| `/restablecer/[token]` | Restablecer contraseña |
| `/verificar/[token]` | Verificar email |

### 👤 Cliente Autenticado

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Panel principal |
| `/dashboard/compras` | Mis compras |
| `/dashboard/etapas` | Ver etapas del proyecto |
| `/dashboard/lotes` | Explorar lotes |
| `/dashboard/pagos` | Gestionar pagos |
| `/dashboard/perfil` | Mi perfil |
| `/dashboard/pqrs` | Mis PQRS |

### ⚙️ Administrador

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard |
| `/admin/usuarios` | Gestionar usuarios |
| `/admin/etapas` | Gestionar etapas |
| `/admin/lotes` | Gestionar lotes |
| `/admin/planos` | Gestionar planos |
| `/admin/compras` | Gestionar compras |
| `/admin/pagos` | Gestionar pagos |
| `/admin/pqrs` | Gestionar PQRS |

---

## 🗄️ Base de Datos

### Esquema de Tablas

#### 📋 usuarios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre |
| apellido | VARCHAR(100) | Apellido |
| email | VARCHAR(255) | Email único |
| telefono | VARCHAR(20) | Teléfono |
| password_hash | VARCHAR(255) | Hash de contraseña |
| rol | VARCHAR(20) | admin / cliente |
| verificado | BOOLEAN | Email verificado |
| token_recuperacion | VARCHAR(255) | Token recuperación |
| created_at | TIMESTAMP | Fecha de creación |

#### 📐 etapas

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre |
| descripcion | TEXT | Descripción |
| orden | INT | Orden visual |
| activa | BOOLEAN | ¿Activa? |
| created_at | TIMESTAMP | Fecha |

#### 🗺️ lotes

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| codigo | VARCHAR(20) | Código |
| area_m2 | DECIMAL | Área m² |
| ubicacion | VARCHAR(255) | Ubicación |
| valor | DECIMAL | Precio |
| estado | VARCHAR(20) | disponible/reservado/vendido |
| etapa_id | INT | FK etapas |
| plano_id | INT | FK planos |
| descripcion | TEXT | Descripción |
| imagen_url | VARCHAR(500) | Imagen |

#### 🤝 compras

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| cliente_id | INT | FK usuarios |
| lote_id | INT | FK lotes |
| valor_total | DECIMAL | Valor total |
| cuota_inicial | DECIMAL | Cuota inicial |
| num_cuotas | INT | Número de cuotas |
| valor_cuota | DECIMAL | Valor cuota |
| saldo_pendiente | DECIMAL | Saldo pendiente |
| fecha_compra | DATE | Fecha de compra |
| estado | VARCHAR(20) | activa/completada/cancelada |

#### 💵 pagos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| compra_id | INT | FK compras |
| monto | DECIMAL | Monto |
| fecha_pago | DATE | Fecha de pago |
| metodo_pago | VARCHAR(50) | Método |
| referencia | VARCHAR(100) | Referencia |
| comprobante_url | VARCHAR(500) | Comprobante |
| tipo | VARCHAR(20) | cuota_inicial / cuota_normal |
| estado | VARCHAR(20) | pendiente/aprobado/rechazado |

#### 📬 pqrs

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| cliente_id | INT | FK usuarios |
| tipo | VARCHAR(20) | peticion/queja/reclamo/sugerencia |
| asunto | VARCHAR(255) | Asunto |
| descripcion | TEXT | Descripción |
| estado | VARCHAR(20) | pendiente/en_proceso/resuelto/cerrado |
| respuesta | TEXT | Respuesta admin |

#### 🏠 planos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL | ID único |
| nombre | VARCHAR(100) | Nombre |
| descripcion | TEXT | Descripción |
| imagen_url | VARCHAR(500) | Imagen plano |

---

## 🔐 Autenticación

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | JWT (HS256) |
| **Duración** | 7 días |
| **Cookie** | `session` (httpOnly) |
| **Protección** | Solo servidor |

### Flujo

```
1. Registro → Email de verificación
2. Verificar → Cuenta activada
3. Login → Token JWT generado
4. Sesión → Cookie httpOnly
```

---

## 📧 Emails

El sistema envía emails automáticos mediante **Resend**:

- ✅ Confirmación de pagos
- ✅ Verificación de cuenta
- ✅ Recuperación de contraseña

---

## 🎨 Estilos

Tema personalizado con identidad visual profesional:

| Elemento | Color |
|----------|-------|
| Primary | `#0b9b44` / `#0ea75c` |
| Background | `#ffffff` |
| Texto | `#043927` |
| Acentos | Verdes naturales |

🌙 **Modo oscuro**: Soportado

---

## 📜 Scripts

```bash
pnpm dev      # Desarrollo
pnpm build    # Producción
pnpm start    # Servidor producción
pnpm lint     # Linter
```

---

## 📄 Licencia

MIT License - Proyecto con fines educativos y de demostración.

---

<div align="center">

Desarrollado con ❤️ para el sector inmobiliario

</div>
