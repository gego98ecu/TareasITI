# Semana 5

Módulo de **Materias** del Sistema Académico ITI conectado a la API REST del docente mediante **Axios** (consultar, registrar, editar y eliminar).

## Proyecto

El código está en la misma carpeta de la semana anterior para conservar el historial de cambios:

- [semana-04/sistema-academico-iti/](../semana-04/sistema-academico-iti/)

Archivos principales de esta entrega:

- [src/services/materiasService.js](../semana-04/sistema-academico-iti/src/services/materiasService.js): capa de servicios con Axios (GET, POST, PUT y DELETE).
- [src/pages/Materias.jsx](../semana-04/sistema-academico-iti/src/pages/Materias.jsx): listado, formulario, validaciones y confirmación de eliminación.
- [.env.example](../semana-04/sistema-academico-iti/.env.example): variable `VITE_API_URL` con la URL de la API.

## Cómo ejecutarlo

```bash
cd semana-04/sistema-academico-iti
cp .env.example .env
npm install
npm run dev
```

Abrir http://localhost:5173/, pulsar **Ingresar al sistema** y elegir **Materias** en el menú.

## Evidencias

Prueba realizada con la materia de prueba `DG001`, que se eliminó al final.

| Operación | Captura |
|---|---|
| Listado | [01-listado.png](evidencias/01-listado.png) |
| Registro: formulario | [02-registro-formulario.png](evidencias/02-registro-formulario.png) |
| Registro: resultado | [03-registro-exitoso.png](evidencias/03-registro-exitoso.png) |
| Edición: formulario con datos y código bloqueado | [04-edicion-formulario.png](evidencias/04-edicion-formulario.png) |
| Eliminación: confirmación | [05-eliminacion-confirmacion.png](evidencias/05-eliminacion-confirmacion.png) |
| Eliminación: resultado | [06-eliminacion-exitosa.png](evidencias/06-eliminacion-exitosa.png) |

[Volver al índice](../README.md)
