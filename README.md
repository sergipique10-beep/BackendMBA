# BackendMBA

API REST construida con **Express + MongoDB Atlas (Mongoose) + Cloudinary**, junto con un frontend en **Vite (JavaScript vanilla)** que consume dicha API. Proyecto del Bootcamp Backend MBA.

## Tabla de contenidos

- [Stack técnico](#stack-técnico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Puesta en marcha](#puesta-en-marcha)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Variables de entorno](#variables-de-entorno)
- [Acceso a MongoDB Atlas (Network Access)](#acceso-a-mongodb-atlas-network-access)
- [Semilla de datos (seed)](#semilla-de-datos-seed)
- [Endpoints de la API](#endpoints-de-la-api)
- [Usuario administrador](#usuario-administrador)

## Stack técnico

**Backend**
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- JWT para autenticación
- Cloudinary + Multer para la subida de imágenes de perfil
- bcryptjs para el hash de contraseñas

**Frontend**
- Vite + JavaScript vanilla (sin framework)
- Fetch API para el consumo del backend

## Estructura del proyecto

```
BackendMBA/
├── backend/
│   ├── index.js                 # Punto de entrada del servidor
│   └── src/
│       ├── config/               # Conexión a MongoDB y configuración de Cloudinary
│       ├── controllers/          # Lógica de negocio (users, posts)
│       ├── middlewares/          # Autenticación, roles y subida de imágenes
│       ├── models/                # Esquemas de Mongoose (User, Post)
│       ├── routes/                # Definición de rutas de la API
│       └── seeds/
│           ├── seed.js            # Script de ejecución del seed
│           └── data/posts.data.js # Datos planos de ejemplo (posts)
└── frontend/
    └── src/
        ├── api/                   # Llamadas fetch al backend
        ├── components/            # Componentes de UI (Header, Posts, Perfil, Admin...)
        └── utils/                 # Helpers (localStorage, iconos)
```

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de [MongoDB Atlas](https://www.mongodb.com/atlas) con un cluster creado
- Una cuenta de [Cloudinary](https://cloudinary.com/) para el almacenamiento de imágenes

## Puesta en marcha

### Backend

```bash
cd backend
npm install
cp .env.example .env   # y completa los valores (ver siguiente sección)
npm run dev             # http://localhost:3000
```

Scripts disponibles:
- `npm run dev` — arranca el servidor con recarga automática (`node --watch`)
- `npm start` — arranca el servidor en modo normal
- `npm run seed` — puebla la colección `posts` con datos de ejemplo

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend no corre en localhost:3000
npm run dev             # http://localhost:5173
```

## Variables de entorno

### `backend/.env`

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde se levanta el servidor Express (por defecto `3000`) |
| `MONGO_URI` | Cadena de conexión de MongoDB Atlas |
| `JWT_SECRET` | Secreto usado para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. `7d`) |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud de Cloudinary |
| `CLOUDINARY_API_KEY` | API key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary |

### `frontend/.env`

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API (ej. `http://localhost:3000/api`) |

> Ambos `.env` están excluidos del control de versiones. Usa los `.env.example` de cada carpeta como plantilla.

## Acceso a MongoDB Atlas (Network Access)

Para que cualquier persona (compañeros, correctores, CI) pueda conectarse al cluster, es necesario habilitar el acceso desde cualquier IP:

1. Entra en [MongoDB Atlas](https://cloud.mongodb.com/) → tu proyecto → **Network Access**.
2. Pulsa **Add IP Address**.
3. Selecciona **Allow Access from Anywhere** (`0.0.0.0/0`) y confirma.

## Semilla de datos (seed)

Los datos de ejemplo (posts) viven en [`backend/src/seeds/data/posts.data.js`](backend/src/seeds/data/posts.data.js), separados del script de ejecución [`backend/src/seeds/seed.js`](backend/src/seeds/seed.js). Para cargarlos en la base de datos:

```bash
cd backend
npm run seed
```

Esto limpia la colección `posts` y la vuelve a poblar con los datos de ejemplo.

## Endpoints de la API

Base URL: `http://localhost:3000/api`

### Usuarios (`/users`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/register` | — | Registro de usuario (admite imagen de perfil) |
| POST | `/login` | — | Login, devuelve JWT |
| GET | `/` | Admin | Lista todos los usuarios |
| GET | `/profile` | Usuario | Perfil del usuario autenticado |
| GET | `/:id` | Usuario/Admin | Perfil de un usuario concreto |
| PUT | `/:id/role` | Admin | Cambia el rol de un usuario (`user`/`admin`) |
| PUT | `/:id` | Usuario/Admin | Actualiza nombre, email o imagen |
| DELETE | `/:id` | Usuario/Admin | Elimina una cuenta |
| POST | `/:id/posts` | Usuario/Admin | Añade un post a favoritos |
| DELETE | `/:id/posts/:postId` | Usuario/Admin | Quita un post de favoritos |

### Posts (`/posts`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | — | Lista posts (paginado, filtrable por `category`) |
| GET | `/:id` | — | Detalle de un post |
| POST | `/` | Admin | Crea un post |
| PUT | `/:id` | Admin | Actualiza un post |
| DELETE | `/:id` | Admin | Elimina un post |

## Usuario administrador


