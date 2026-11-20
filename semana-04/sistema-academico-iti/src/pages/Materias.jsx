import { useEffect, useState } from "react";
import { materiasService } from "../services/materiasService";

const materiaInicial = {
  codigo: "",
  nombre: "",
  descripcion: "",
  creditos: "",
  estado: "Activo",
  carrera: "",
};

function Materias() {
  // Estados del formulario y de la lista de materias
  const [materia, setMateria] = useState(materiaInicial);
  const [materias, setMaterias] = useState([]);

  // Estados para mensajes de éxito y error
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Estados para mostrar el formulario y saber si se está editando
  // codigoEditando guarda el código original de la materia en edición (null = registro nuevo)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [codigoEditando, setCodigoEditando] = useState(null);

  // Estado para la ventana de confirmación de eliminación (null = cerrada)
  const [codigoEliminar, setCodigoEliminar] = useState(null);

  // Estados para saber si se están cargando o guardando datos en la API
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Devuelve un mensaje entendible según el error de la petición
  const obtenerMensajeError = (err) => {
    if (err.code === "ERR_NETWORK") {
      return "No se pudo conectar con el servidor. Verifique su conexión o intente más tarde.";
    }

    if (err.code === "ECONNABORTED") {
      return "El servidor tardó demasiado en responder. Intente nuevamente.";
    }

    // Si la API envía un mensaje, se muestra ese mensaje
    return err.response?.data?.mensaje || "Ocurrió un error en la operación.";
  };

  // Consulta las materias en la API (GET) y actualiza la tabla
  // (cargando empieza en true, por eso aquí solo se pone en false al terminar)
  const cargarMaterias = async () => {
    try {
      const datos = await materiasService.listar();
      setMaterias(datos);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  // Carga las materias una sola vez, cuando se abre la página
  // Los corchetes vacíos [] indican que se ejecuta solo al inicio
  // Los estados se actualizan cuando llega la respuesta de la API (.then / .catch / .finally)
  useEffect(() => {
    materiasService
      .listar()
      .then((datos) => setMaterias(datos))
      .catch((err) => setError(obtenerMensajeError(err)))
      .finally(() => setCargando(false));
  }, []);

  // Función para manejar los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setMateria({
      ...materia,
      [name]: value,
    });
  };

  // Oculta la tabla y muestra el formulario vacío para registrar una materia nueva
  const abrirAgregar = () => {
    setMateria({ ...materiaInicial });
    setCodigoEditando(null);
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  };

  // Oculta la tabla y muestra el formulario con los datos de la materia seleccionada
  const abrirEditar = (mat) => {
    setMateria({ ...mat });
    setCodigoEditando(mat.codigo);
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  };

  // Regresa al listado sin guardar
  const cancelarFormulario = () => {
    setMateria({ ...materiaInicial });
    setCodigoEditando(null);
    setError("");
    setMostrarFormulario(false);
  };

  // Función para grabar la materia en la API (POST para nueva, PUT para editar)
  const grabarMateria = async (e) => {
    e.preventDefault();

    setError("");

    // Validación de campos obligatorios
    if (
      !materia.codigo ||
      !materia.nombre ||
      !materia.descripcion ||
      !materia.creditos ||
      !materia.carrera
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // El código no puede contener espacios
    if (/\s/.test(materia.codigo)) {
      setError("El código no puede contener espacios.");
      return;
    }

    // El código debe ser alfanumérico (solo letras y números)
    if (!/^[a-zA-Z0-9]+$/.test(materia.codigo)) {
      setError("El código solo puede contener letras y números.");
      return;
    }

    // Validación de código repetido (sin distinguir mayúsculas/minúsculas)
    // (se ignora la materia que se está editando)
    const codigoRepetido = materias.some(
      (mat) =>
        mat.codigo !== codigoEditando &&
        mat.codigo.toLowerCase() === materia.codigo.toLowerCase(),
    );

    if (codigoRepetido) {
      setError("El código ingresado ya está registrado.");
      return;
    }

    // Nombre y descripción no pueden ser solo espacios
    if (materia.nombre.trim() === "" || materia.descripcion.trim() === "") {
      setError("El nombre y la descripción no pueden estar vacíos o tener solo espacios.");
      return;
    }

    // Los créditos deben ser un número entero mayor que cero
    // (solo dígitos, así no se aceptan decimales ni valores como "1e2")
    if (!/^[0-9]+$/.test(materia.creditos) || Number(materia.creditos) <= 0) {
      setError("El número de créditos debe ser un número entero mayor que cero.");
      return;
    }

    // El estado solo puede ser Activo o Inactivo
    if (materia.estado !== "Activo" && materia.estado !== "Inactivo") {
      setError("Seleccione un estado válido: Activo o Inactivo.");
      return;
    }

    // Datos que se envían a la API
    // (id y fecha_registro los genera la base de datos, por eso no se envían)
    const datosMateria = {
      codigo: materia.codigo,
      nombre: materia.nombre,
      descripcion: materia.descripcion,
      creditos: Number(materia.creditos),
      estado: materia.estado,
      carrera: materia.carrera,
    };

    try {
      setGuardando(true);

      if (codigoEditando) {
        // Actualizar la materia en la API
        await materiasService.modificar(codigoEditando, datosMateria);
        setMensaje("Materia actualizada exitosamente.");
      } else {
        // Registrar la materia en la API
        await materiasService.crear(datosMateria);
        setMensaje("Materia registrada exitosamente.");
      }

      // Ocultar el formulario, limpiar y volver a cargar la tabla
      setMateria({ ...materiaInicial });
      setCodigoEditando(null);
      setMostrarFormulario(false);
      await cargarMaterias();
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  // Elimina la materia en la API (DELETE), solo después de confirmar
  const eliminarMateria = async () => {
    if (!codigoEliminar) return;

    try {
      setGuardando(true);
      setMensaje("");
      setError("");
      await materiasService.eliminar(codigoEliminar);
      setMensaje("Materia eliminada exitosamente.");
      await cargarMaterias();
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCodigoEliminar(null);
      setGuardando(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold">
          <i className="bi bi-book me-2"></i>
          Materias
        </h3>

        <p className="text-muted mb-0">Administración y registro de materias</p>
      </div>

      {mensaje && (
        <div className="alert alert-success" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {mensaje}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* FORMULARIO (se muestra en lugar de la tabla) */}

      {mostrarFormulario && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className={`bi ${codigoEditando ? "bi-pencil-square" : "bi-plus-lg"} me-2`}></i>
              {codigoEditando ? "Editar materia" : "Registrar materia"}
            </h5>
          </div>

          <div className="card-body p-4">
            {/* noValidate desactiva la validación del navegador para que se vean nuestros mensajes */}
            <form onSubmit={grabarMateria} noValidate>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="codigo" className="form-label">Código</label>

                  {/* El código se bloquea cuando se está editando */}
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    className="form-control"
                    placeholder="Ej: DG001"
                    value={materia.codigo}
                    onChange={manejarCambio}
                    disabled={codigoEditando !== null}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>

                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-control"
                    placeholder="Ingrese el nombre de la materia"
                    value={materia.nombre}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>

                  <textarea
                    id="descripcion"
                    name="descripcion"
                    className="form-control"
                    rows="3"
                    placeholder="Ingrese la descripción de la materia"
                    value={materia.descripcion}
                    onChange={manejarCambio}
                    required
                  ></textarea>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="creditos" className="form-label">Número de créditos</label>

                  <input
                    type="number"
                    id="creditos"
                    name="creditos"
                    className="form-control"
                    placeholder="Ej: 4"
                    min="1"
                    step="1"
                    value={materia.creditos}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="estado" className="form-label">Estado</label>

                  <select
                    id="estado"
                    name="estado"
                    className="form-select"
                    value={materia.estado}
                    onChange={manejarCambio}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label htmlFor="carrera" className="form-label">Carrera</label>

                  <select
                    id="carrera"
                    name="carrera"
                    className="form-select"
                    value={materia.carrera}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Seleccione una carrera</option>
                    <option value="Desarrollo de Software">Desarrollo de Software</option>
                    <option value="Administración">Administración</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={cancelarFormulario}
                  disabled={guardando}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Cancelar
                </button>

                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  <i className="bi bi-floppy me-2"></i>
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLA DE MATERIAS (se oculta mientras se muestra el formulario) */}

      {!mostrarFormulario && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              Materias registradas
            </h5>

            <button
              type="button"
              className="btn btn-primary"
              onClick={abrirAgregar}
              disabled={cargando}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Agregar
            </button>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Créditos</th>
                    <th>Estado</th>
                    <th>Carrera</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {cargando ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        Cargando materias...
                      </td>
                    </tr>
                  ) : materias.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No hay materias registradas.
                      </td>
                    </tr>
                  ) : (
                    materias.map((mat) => (
                      <tr key={mat.codigo}>
                        <td>{mat.codigo}</td>
                        <td>{mat.nombre}</td>
                        <td>{mat.descripcion}</td>
                        <td>{mat.creditos}</td>
                        <td>{mat.estado}</td>
                        <td>{mat.carrera}</td>
                        <td className="text-center text-nowrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => abrirEditar(mat)}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setCodigoEliminar(mat.codigo)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VENTANA DE CONFIRMACIÓN PARA ELIMINAR */}
      {/* Se muestra cuando codigoEliminar tiene un valor (sin manipular el DOM) */}

      {codigoEliminar && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Confirmar eliminación
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setCodigoEliminar(null)}
                    disabled={guardando}
                  ></button>
                </div>

                <div className="modal-body">
                  ¿Está seguro de eliminar la materia con código <strong>{codigoEliminar}</strong>?
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setCodigoEliminar(null)}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={eliminarMateria}
                    disabled={guardando}
                  >
                    <i className="bi bi-trash me-2"></i>
                    {guardando ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fondo oscuro detrás de la ventana */}
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}

export default Materias;
