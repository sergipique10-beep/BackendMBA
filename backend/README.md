# BackendMBA — API REST con Express, MongoDB Atlas y Cloudinary

API REST desarrollada con Node.js, Express, MongoDB Atlas y Cloudinary como proyecto final del módulo de Backend.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18 | Entorno de ejecución |
| Express | 5.x | Framework HTTP |
| Mongoose | 9.x | ODM para MongoDB |
| MongoDB Atlas | — | Base de datos en la nube |
| Cloudinary | 1.x | Almacenamiento de imágenes |
| bcryptjs | 3.x | Hash de contraseñas |
| jsonwebtoken | 9.x | Autenticación JWT |
| multer | 2.x | Procesamiento de ficheros |
| cors | 2.x | Habilita peticiones desde el frontend (otro origen/puerto) |
| dotenv | 17.x | Variables de entorno |

---

## Estructura del proyecto

Este backend forma parte de un repositorio monorepo: la raíz contiene esta carpeta (`backend/`, el servidor Express — proyecto evaluado) y `frontend/` (cliente Vite + JS vanilla que consume esta API, no forma parte del encargo).

```
BackendMBA/
├── backend/                     ← este proyecto
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js               # Conexión a MongoDB Atlas
│   │   │   └── cloudinary.js       # Configuración de Cloudinary
│   │   ├── controllers/
│   │   │   ├── user.controller.js  # Lógica de negocio de usuarios
│   │   │   └── post.controller.js  # Lógica de negocio de posts
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js  # Autenticación JWT + isAdmin
│   │   │   └── upload.middleware.js # Subida de imágenes con Cloudinary
│   │   ├── models/
│   │   │   ├── User.js             # Modelo de usuario
│   │   │   └── Post.js             # Modelo de post
│   │   ├── routes/
│   │   │   ├── user.routes.js      # Rutas de usuarios
│   │   │   └── post.routes.js      # Rutas de posts
│   │   └── seeds/
│   │       └── seed.js             # Semilla de posts iniciales
│   ├── .env                        # Variables de entorno (incluido para corrección)
│   ├── index.js                    # Punto de entrada del servidor
│   ├── package.json
│   └── README.md                   # este archivo
└── frontend/                    ← cliente de la API (no evaluado)
```

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/BackendMBA.git
cd BackendMBA/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Edita el archivo `.env` con tus credenciales reales:

```env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/backendmba
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Ejecutar la semilla (opcional)

Carga 8 posts de ejemplo en la base de datos:

```bash
npm run seed
```

### 5. Iniciar el servidor

```bash
# Producción
npm start

# Desarrollo (con auto-reload)
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

---

## Modelos de datos

### User

| Campo | Tipo | Descripción |
|---|---|---|
| name | String | Nombre del usuario (obligatorio) |
| email | String | Email único (obligatorio) |
| password | String | Hash bcrypt (no se devuelve en queries) |
| role | String | `"user"` o `"admin"` (por defecto `"user"`) |
| image.url | String | URL de Cloudinary |
| image.public_id | String | ID público en Cloudinary (para eliminar) |
| posts | ObjectId[] | Array de posts favoritos (sin duplicados) |

> **Primer admin:** créalo directamente desde MongoDB Atlas cambiando `role` de `"user"` a `"admin"`.

### Post

| Campo | Tipo | Descripción |
|---|---|---|
| title | String | Título (obligatorio) |
| description | String | Descripción breve (obligatoria) |
| content | String | Contenido completo (obligatorio) |
| category | String | `tecnología`, `ciencia`, `cultura`, `deportes`, `política`, `otros` |
| author | String | Nombre del autor (por defecto `"Anónimo"`) |

---

## Endpoints de la API

### Usuarios — `/api/users`

| Método | Ruta | Auth | Rol | Descripción |
|---|---|---|---|---|
| POST | `/register` | No | — | Registrar usuario (multipart/form-data con `image`) |
| POST | `/login` | No | — | Iniciar sesión |
| GET | `/` | Sí | Admin | Listar todos los usuarios |
| GET | `/profile` | Sí | Cualquiera | Ver perfil propio |
| GET | `/:id` | Sí | Propio o Admin | Ver usuario por ID |
| PUT | `/:id/role` | Sí | Admin | Cambiar rol de un usuario |
| PUT | `/:id` | Sí | Propio o Admin | Actualizar `name`/`email`/`image` (multipart/form-data, reemplaza la imagen en Cloudinary) |
| DELETE | `/:id` | Sí | Propio o Admin | Eliminar cuenta + imagen de Cloudinary |
| POST | `/:id/posts` | Sí | Propio o Admin | Añadir post a favoritos (sin duplicados) |
| DELETE | `/:id/posts/:postId` | Sí | Propio o Admin | Quitar post de favoritos |

### Posts — `/api/posts`

| Método | Ruta | Auth | Rol | Descripción |
|---|---|---|---|---|
| GET | `/` | No | — | Listar posts (con filtro `?category=` y paginación) |
| GET | `/:id` | No | — | Ver post por ID |
| POST | `/` | Sí | Admin | Crear post |
| PUT | `/:id` | Sí | Admin | Actualizar post |
| DELETE | `/:id` | Sí | Admin | Eliminar post |

---

## Reglas de negocio implementadas

### Roles y permisos

- Los usuarios solo se pueden registrar con el rol `"user"`.
- El **primer administrador** debe crearse manualmente desde MongoDB Atlas cambiando el campo `role` a `"admin"`.
- Un **admin** puede cambiar el rol de cualquier usuario.
- Un **usuario normal** no puede cambiar su propio rol ni el de nadie más.

### Edición de cuentas

- El propio usuario o un **admin** pueden actualizar `name`, `email` e `image`.
- Si se sube una imagen nueva, la anterior se **elimina automáticamente de Cloudinary** antes de guardar la nueva.
- Este endpoint **nunca** modifica el `role`, aunque se envíe en el body — el rol solo se cambia vía `PUT /:id/role`.

### Eliminación de cuentas

- Un usuario puede **eliminar su propia cuenta**.
- Un **admin** puede eliminar cualquier cuenta.
- Un usuario **no puede eliminar** la cuenta de otro usuario.
- Al eliminar una cuenta, la imagen asociada se **elimina automáticamente de Cloudinary**.

### Posts favoritos

- Los posts favoritos se añaden con `$addToSet`, lo que **garantiza a nivel de base de datos que no haya duplicados**.
- Antes de añadir, se comprueba en el controlador si ya existe en el array.
- Al añadir nuevos favoritos, los anteriores **no se sobreescriben**: se usan operadores de actualización de Mongoose (`$addToSet` / `$pull`).

---

## Autenticación

La API utiliza **JWT (JSON Web Tokens)**. Tras hacer login o registro, recibirás un token que debes incluir en las cabeceras de las peticiones protegidas:

```
Authorization: Bearer <tu_token_aqui>
```

---

## Ejemplos de uso

### Registro de usuario con imagen

```bash
curl -X POST http://localhost:3000/api/users/register \
  -F "name=Sergi" \
  -F "email=sergi@email.com" \
  -F "password=123456" \
  -F "image=@/ruta/a/tu/foto.jpg"
```

### Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sergi@email.com","password":"123456"}'
```

### Añadir post a favoritos

```bash
curl -X POST http://localhost:3000/api/users/<userId>/posts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"postId":"<postId>"}'
```

### Actualizar usuario (propio o admin)

```bash
curl -X PUT http://localhost:3000/api/users/<userId> \
  -H "Authorization: Bearer <token>" \
  -F "name=Nuevo Nombre" \
  -F "image=@/ruta/a/nueva-foto.jpg"
```

### Cambiar rol (solo admin)

```bash
curl -X PUT http://localhost:3000/api/users/<userId>/role \
  -H "Authorization: Bearer <token_admin>" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'
```

### Ejecutar la semilla

```bash
npm run seed
```

---

## Notas para la corrección

- El archivo `.env` está incluido en el repositorio **exclusivamente para facilitar la corrección** del proyecto escolar. En un proyecto real nunca se subiría.
- El primer usuario administrador debe configurarse **directamente en MongoDB Atlas** cambiando el campo `role` de `"user"` a `"admin"` en el documento deseado.
- La semilla (`npm run seed`) limpia la colección de posts y carga 8 posts de ejemplo con distintas categorías.

---

*Proyecto final del módulo de Backend — MBA Bootcamp*
