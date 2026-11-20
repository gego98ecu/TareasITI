# Sistema Académico ITI

Aplicación web desarrollada con **React.js + Vite** para la administración académica del Instituto Tecnológico ITI.

## Módulos

- **Inicio de sesión** y navegación con menú lateral.
- **Estudiantes:** registro y actualización en ventanas modales (datos en memoria).
- **Materias:** consulta, registro, edición y eliminación mediante la **API REST** del docente (Node.js + Express, PostgreSQL en Supabase), consumida con **Axios**.

## Tecnologías

- React.js 19 + Vite
- React Router
- Bootstrap 5 y Bootstrap Icons
- Axios

## Requisitos

- Node.js 20 o superior
- npm

## Instalación

```bash
npm install
```

## Configuración

1. Copiar el archivo `.env.example` y renombrarlo a `.env`:

   ```bash
   cp .env.example .env
   ```

2. Verificar que la variable apunte a la API:

   ```
   VITE_API_URL=https://backend-academico-iti.onrender.com/api
   ```

Si el archivo `.env` no existe, la aplicación usa esa misma URL por defecto.

## Ejecución

```bash
npm run dev
```

Abrir http://localhost:5173/, pulsar **Ingresar al sistema** y elegir **Materias** en el menú.

> La API solo acepta peticiones desde `http://localhost:5173`. Si Vite arranca en otro puerto, cierre el otro proceso que usa el 5173.
>
> El servidor de la API está en Render y puede tardar hasta un minuto en responder la primera vez.

## Estructura

```
src/
├── components/   Header, Sidebar, Main, Footer y Layout
├── pages/        Login, Inicio, Estudiantes y Materias
├── services/     materiasService.js (peticiones HTTP con Axios)
├── App.jsx       Rutas de la aplicación
└── main.jsx      Punto de entrada
```

## API de materias

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/materias` | Consultar todas las materias |
| GET | `/api/materias/:codigo` | Consultar una materia por su código |
| POST | `/api/materias` | Registrar una materia |
| PUT | `/api/materias/:codigo` | Actualizar una materia |
| DELETE | `/api/materias/:codigo` | Eliminar una materia |
