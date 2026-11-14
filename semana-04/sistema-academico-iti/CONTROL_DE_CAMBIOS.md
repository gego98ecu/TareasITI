# Control de cambios – Sistema Académico ITI

Este documento registra los cambios realizados en el proyecto, el motivo de cada uno y cómo se implementó.

---

## Versión 1.1 – 14/11/2026

### Resumen

| # | Cambio | Archivo(s) | Actividad |
|---|--------|------------|-----------|
| 1 | Formulario de estudiantes en ventana modal | `src/pages/Estudiantes.jsx` | 1, 2, 4 |
| 2 | Botón **Agregar** en la parte superior de la tabla | `src/pages/Estudiantes.jsx` | 2 |
| 3 | Botón **Actualizar** en cada fila | `src/pages/Estudiantes.jsx` | 1 |
| 4 | Cédula bloqueada al actualizar | `src/pages/Estudiantes.jsx` | 1 |
| 5 | Botones **Guardar** y **Cancelar**; se eliminó **Limpiar** | `src/pages/Estudiantes.jsx` | 1, 2, 4 |
| 5.1 | Ajustes internos (funciones, mensajes y alertas) | `src/pages/Estudiantes.jsx` | 1, 2 |
| 6 | Nuevo módulo de Materias | `src/pages/Materias.jsx` | 3, 4 |
| 7 | Ruta `/materias` en el menú | `src/App.jsx` | 3 |
| 8 | La cédula solo acepta números | `src/pages/Estudiantes.jsx` | Corrección |
| 9 | Se muestran los mensajes de validación propios | `Estudiantes.jsx`, `Materias.jsx` | Corrección |
| 10 | Validación del formato del correo | `src/pages/Estudiantes.jsx` | Corrección |
| 11 | Créditos: solo números enteros | `src/pages/Materias.jsx` | Corrección |
| 12 | Etiquetas enlazadas a sus campos | `Estudiantes.jsx`, `Materias.jsx` | Corrección |
| 13 | Se eliminó la carpeta `dist/` | `dist/` | Corrección |

---

### Actividad 1 y 2 – Módulo de Estudiantes

**Archivo:** `src/pages/Estudiantes.jsx`

#### 1. Formulario en ventana modal

- **Antes:** el formulario aparecía dentro de la página, encima de la tabla.
- **Ahora:** el formulario se abre en una **ventana modal** (popup) de Bootstrap. La ventana se muestra encima de la tabla y oscurece el fondo. La tabla sigue siendo la pantalla principal.
- **Cómo se hizo:** el modal se muestra u oculta con el estado `mostrarModal` (`useState`) y las clases de Bootstrap `modal`, `modal-dialog`, `modal-content` y `modal-backdrop`. No se usa el JavaScript de Bootstrap ni se manipula el DOM directamente, como piden las consideraciones técnicas.

```jsx
const [mostrarModal, setMostrarModal] = useState(false);

{mostrarModal && (
  <>
    <div className="modal d-block" tabIndex="-1"> ... </div>
    <div className="modal-backdrop show"></div>
  </>
)}
```

- El estado `mostrarFormulario` se renombró a `mostrarModal`.
- Los mensajes de error se muestran **dentro del modal**. El mensaje de éxito se muestra en la página después de cerrarlo.

#### 2. Botón Agregar

- Se movió al encabezado de la tarjeta de la tabla y su texto ahora es **"Agregar"**.
- La función `abrirAgregar()` vacía el formulario, deja `cedulaEditando` en `null` y abre el modal.

#### 3. Botón Actualizar

- El botón de cada fila pasó de "Editar" a **"Actualizar"**.
- La función `abrirEditar(est)` copia los datos del estudiante seleccionado al formulario, guarda su cédula en `cedulaEditando` y abre el modal.

#### 4. Registro o actualización

El estado `cedulaEditando` indica qué operación se está haciendo:

| `cedulaEditando` | Operación | Título del modal | Botón |
|---|---|---|---|
| `null` | Registro nuevo | Registrar estudiante | Guardar |
| una cédula | Actualización | Actualizar estudiante | Guardar cambios |

#### 5. Cédula bloqueada al actualizar

```jsx
disabled={cedulaEditando !== null}
```

La cédula funciona como identificador del estudiante, por eso no se puede modificar.

#### 6. Botones Guardar y Cancelar

- **Guardar:** valida los datos. Si todo es correcto, agrega o reemplaza el estudiante en la lista, cierra el modal y la tabla se actualiza.
- **Cancelar** (o la X del modal): cierra el modal sin modificar los registros.
- **Se eliminó el botón Limpiar.** En modo actualización borraba también la cédula, que está bloqueada y no se podía volver a escribir.

#### 7. Otros ajustes internos en Estudiantes

Son cambios pequeños hechos al pasar el formulario al modal:

| Cambio | Explicación |
|---|---|
| Se eliminó la función `limpiarFormulario()` | Solo la usaba el botón Limpiar. Cada función (`abrirAgregar`, `abrirEditar`, `cancelarFormulario`, `grabarEstudiante`) ahora vacía el formulario por su cuenta. |
| Se quitaron los `setMensaje("")` de cada validación | El mensaje de éxito ya se borra al abrir el modal, así que repetirlo en cada validación no hacía falta. |
| El mensaje de éxito se asigna dentro del `if/else` | Antes se usaba una variable `textoExito`. Ahora se llama a `setMensaje(...)` directamente al registrar o al actualizar. |
| La alerta de error salió de la página y pasó al modal | Así el usuario ve el error junto al formulario que tiene que corregir. |
| Se quitaron las clases `alert-dismissible fade show` de las alertas | Esas clases necesitan el JavaScript de Bootstrap, que el proyecto no usa. |
| El encabezado de la página quedó solo con el título | El botón que estaba al lado del título se movió a la tarjeta de la tabla (punto 2). |

---

### Actividad 3 – Módulo de Materias

**Archivo nuevo:** `src/pages/Materias.jsx`

Se creó con la misma estructura y estilo que el módulo de Estudiantes.

#### Campos

| Campo | Tipo | Validación |
|---|---|---|
| Código | Alfanumérico | Obligatorio, solo letras y números, sin espacios, único (sin importar mayúsculas o minúsculas) |
| Nombre | Texto | Obligatorio, no solo espacios |
| Descripción | Texto (textarea) | Obligatorio, no solo espacios |
| Número de créditos | Entero | Solo dígitos y mayor que cero |
| Estado | Selección | Activo / Inactivo |

#### Funciones

| Función | Qué hace |
|---|---|
| `manejarCambio` | Actualiza el estado `materia` cuando se escribe en un campo |
| `abrirAgregar` | Abre el modal con el formulario vacío |
| `abrirEditar` | Abre el modal con los datos de la materia seleccionada |
| `cancelarFormulario` | Cierra el modal sin guardar |
| `grabarMateria` | Valida los datos, agrega o actualiza la materia y cierra el modal |

- El estado `codigoEditando` cumple la misma función que `cedulaEditando` en Estudiantes.
- Al actualizar, el **código queda bloqueado**.
- La tabla empieza vacía y se actualiza después de cada operación.

#### Navegación

**Archivo:** `src/App.jsx`

Se importó el componente `Materias` y se agregó la ruta `/materias` dentro de `<Layout>`. La opción "Materias" del menú (`Sidebar.jsx`) ya existía pero no tenía ruta, por eso llevaba al Login. Ahora abre el nuevo módulo.

```jsx
<Route
  path="/materias"
  element={
    <Layout>
      <Materias />
    </Layout>
  }
/>
```

---

### Correcciones después de la revisión

#### 8. La cédula aceptaba letras

- **Problema:** solo se revisaba que la cédula tuviera 10 caracteres, así que `ABCDEFGHIJ` se guardaba.
- **Solución:** se agregó una validación para que solo acepte números.

```jsx
if (!/^[0-9]+$/.test(estudiante.cedula)) {
  setError("La cédula solo puede contener números.");
  return;
}
```

#### 9. Los mensajes de validación propios no se mostraban

- **Problema:** los atributos `required`, `min` y `step` hacían que el navegador detuviera el formulario con su propio globo. Así, los mensajes en rojo del sistema nunca aparecían.
- **Solución:** se agregó `noValidate` a los dos formularios. Ahora todas las validaciones las hace React y se muestran los mensajes propios.

```jsx
<form onSubmit={grabarEstudiante} noValidate>
```

#### 10. Validación del formato del correo

- **Problema:** con `noValidate`, el navegador también deja de revisar el formato del correo.
- **Solución:** se agregó una validación propia (formato `texto@texto.dominio`).

```jsx
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(estudiante.correo)) {
  setError("El correo electrónico no tiene un formato válido.");
  return;
}
```

#### 11. Créditos aceptaba notación científica

- **Problema:** el campo numérico aceptaba valores como `1e2` (igual a 100).
- **Solución:** los créditos solo aceptan dígitos y deben ser mayores que cero. Se rechazan `1e2`, `2.5`, `-3` y `0`.

```jsx
if (!/^[0-9]+$/.test(materia.creditos) || Number(materia.creditos) <= 0) {
  setError("El número de créditos debe ser un número entero mayor que cero.");
  return;
}
```

#### 12. Etiquetas enlazadas a sus campos (accesibilidad)

- Cada `<label>` tiene `htmlFor` y cada campo tiene el `id` correspondiente. Al hacer clic en la etiqueta, el cursor se coloca en el campo, y los lectores de pantalla leen el nombre del campo.
- El botón X del modal tiene `aria-label="Cerrar"`.

```jsx
<label htmlFor="cedula" className="form-label">Cédula</label>
<input id="cedula" name="cedula" ... />
```

#### 13. Se eliminó la carpeta `dist/`

Contenía un build anterior que ya no correspondía al código actual. Se vuelve a generar con `npm run build` y ya está en `.gitignore`.

---

### Archivos sin cambios

`Header.jsx`, `Footer.jsx`, `Main.jsx`, `Layout.jsx`, `Sidebar.jsx`, `Login.jsx`, `Inicio.jsx`, `index.css` y `main.jsx`.

Se mantiene la estructura de componentes Header, Sidebar (menú de navegación), Main, Footer y Layout.

---

### Observaciones pendientes (no corregidas)

| Observación | Detalle |
|---|---|
| Los datos se pierden al cambiar de página | Cada lista se guarda en el estado de su propia página. Al salir de la página o recargar, se borra. Lo permite el alcance de la evaluación. |
| "Matrículas" redirige al Login | La ruta `/matriculas` todavía no existe. |
| Validaciones de Materias más simples | Nombre y descripción aceptan espacios al inicio, al final o dobles. |
| Nombres y apellidos aceptan números | Por ejemplo, `Juan123`. |
| Comportamiento del modal | No se cierra con Esc ni al hacer clic en el fondo, y la página de atrás se puede desplazar. |
| Login sin validación | Cualquiera entra con un clic. Ya estaba así antes de estos cambios. |
| `index.html` | `lang="en"` y título `sistema-academico-iti`. |
| Espacio faltante en `App.jsx` | `<Route path="*"element=...>` funciona, pero le falta un espacio. |
