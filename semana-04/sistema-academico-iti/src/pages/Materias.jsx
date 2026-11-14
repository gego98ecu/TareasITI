import { useState } from "react";

const materiaInicial = {
  codigo: "",
  nombre: "",
  descripcion: "",
  creditos: "",
  estado: "Activo",
};

function Materias() {
  // Estados del formulario y de la lista de materias
  const [materia, setMateria] = useState(materiaInicial);
  const [materias, setMaterias] = useState([]);

  // Estados para mensajes de éxito y error
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Estados para mostrar la ventana modal y saber si se está actualizando
  // codigoEditando guarda el código original de la materia en edición (null = registro nuevo)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [codigoEditando, setCodigoEditando] = useState(null);

  // Función para manejar los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setMateria({
      ...materia,
      [name]: value,
    });
  };

  // Abre la ventana modal con el formulario vacío para registrar una materia nueva
  const abrirAgregar = () => {
    setMateria({ ...materiaInicial });
    setCodigoEditando(null);
    setMensaje("");
    setError("");
    setMostrarModal(true);
  };

  // Abre la ventana modal con los datos de la materia seleccionada
  const abrirEditar = (mat) => {
    setMateria({ ...mat });
    setCodigoEditando(mat.codigo);
    setMensaje("");
    setError("");
    setMostrarModal(true);
  };

  // Cierra la ventana modal sin guardar
  const cancelarFormulario = () => {
    setMateria({ ...materiaInicial });
    setCodigoEditando(null);
    setError("");
    setMostrarModal(false);
  };

  // Función para grabar la materia en la lista de materias
  const grabarMateria = (e) => {
    e.preventDefault();

    setError("");

    // Validación de campos obligatorios
    if (
      !materia.codigo ||
      !materia.nombre ||
      !materia.descripcion ||
      !materia.creditos
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

    if (codigoEditando) {
      // Reemplazar la materia actualizada en la lista
      setMaterias(materias.map((mat) => (mat.codigo === codigoEditando ? materia : mat)));
      setMensaje("Materia actualizada exitosamente.");
    } else {
      // Agregar la materia a la lista de materias
      setMaterias([...materias, materia]);
      setMensaje("Materia registrada exitosamente.");
    }

    // Cerrar la ventana modal y limpiar el formulario
    setMateria({ ...materiaInicial });
    setCodigoEditando(null);
    setMostrarModal(false);
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

      {/* TABLA DE MATERIAS */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Materias registradas
          </h5>

          <button type="button" className="btn btn-primary" onClick={abrirAgregar}>
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
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {materias.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
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
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => abrirEditar(mat)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Actualizar
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

      {/* VENTANA MODAL CON EL FORMULARIO */}
      {/* Se muestra u oculta con el estado mostrarModal (sin manipular el DOM) */}

      {mostrarModal && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                {/* noValidate desactiva la validación del navegador para que se vean nuestros mensajes */}
                <form onSubmit={grabarMateria} noValidate>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <i
                        className={`bi ${codigoEditando ? "bi-pencil-square" : "bi-plus-lg"} me-2`}
                      ></i>
                      {codigoEditando ? "Actualizar materia" : "Registrar materia"}
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Cerrar"
                      onClick={cancelarFormulario}
                    ></button>
                  </div>

                  <div className="modal-body">
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                      </div>
                    )}

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="codigo" className="form-label">Código</label>

                        {/* El código se bloquea cuando se está actualizando */}
                        <input
                          type="text"
                          id="codigo"
                          name="codigo"
                          className="form-control"
                          placeholder="Ej: PROG101"
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

                      <div className="col-md-6 mb-3">
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

                      <div className="col-md-6 mb-3">
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
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={cancelarFormulario}
                    >
                      <i className="bi bi-x-lg me-2"></i>
                      Cancelar
                    </button>

                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-floppy me-2"></i>
                      {codigoEditando ? "Guardar cambios" : "Guardar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Fondo oscuro detrás de la ventana modal */}
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  );
}

export default Materias;
