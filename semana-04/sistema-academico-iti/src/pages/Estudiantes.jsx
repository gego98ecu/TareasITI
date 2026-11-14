import { useState } from "react";

const estudianteInicial = {
  cedula: "",
  fechaNacimiento: "",
  nombres: "",
  apellidos: "",
  correo: "",
  carrera: "",
  estado: "Activo",
};

function Estudiantes() {
  // Estados del formulario y de la lista de estudiantes
  const [estudiante, setEstudiante] = useState(estudianteInicial);
  const [estudiantes, setEstudiantes] = useState([]);

  // Estados para mensajes de éxito y error
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Estados para mostrar la ventana modal y saber si se está actualizando
  // cedulaEditando guarda la cédula original del estudiante en edición (null = registro nuevo)
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cedulaEditando, setCedulaEditando] = useState(null);

  // Función para manejar los cambios en los campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setEstudiante({
      ...estudiante,
      [name]: value,
    });
  };

  // Abre la ventana modal con el formulario vacío para registrar un estudiante nuevo
  const abrirAgregar = () => {
    setEstudiante({ ...estudianteInicial });
    setCedulaEditando(null);
    setMensaje("");
    setError("");
    setMostrarModal(true);
  };

  // Abre la ventana modal con los datos del estudiante seleccionado
  const abrirEditar = (est) => {
    setEstudiante({ ...est });
    setCedulaEditando(est.cedula);
    setMensaje("");
    setError("");
    setMostrarModal(true);
  };

  // Cierra la ventana modal sin guardar
  const cancelarFormulario = () => {
    setEstudiante({ ...estudianteInicial });
    setCedulaEditando(null);
    setError("");
    setMostrarModal(false);
  };

  //Función para grabar el estudiante en la lista de estudiantes
  const grabarEstudiante = (e) => {
    e.preventDefault();

    setError("");

    // Validación de campos obligatorios
    if (
      !estudiante.cedula ||
      !estudiante.fechaNacimiento ||
      !estudiante.nombres ||
      !estudiante.apellidos ||
      !estudiante.correo ||
      !estudiante.carrera
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    //Valida la longitud de la cédula
    if (estudiante.cedula.length !== 10) {
      setError("La cédula debe tener exactamente 10 dígitos.");
      return;
    }

    // Valida que la cédula contenga solo números
    if (!/^[0-9]+$/.test(estudiante.cedula)) {
      setError("La cédula solo puede contener números.");
      return;
    }

    // Validación de cédula repetida
    // (se ignora al estudiante que se está editando)
    const cedulaRepetida = estudiantes.some(
      (est) => est.cedula !== cedulaEditando && est.cedula === estudiante.cedula,
    );

    if (cedulaRepetida) {
      setError("La cédula ingresada ya está registrada.");
      return;
    }

    // Validación de espacios en los campos de texto
    // Cédula y correo no pueden contener ningún espacio
    if (/\s/.test(estudiante.cedula) || /\s/.test(estudiante.correo)) {
      setError("La cédula y el correo no pueden contener espacios.");
      return;
    }

    // Valida el formato del correo (texto@texto.dominio)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(estudiante.correo)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    // Nombres y apellidos: no solo espacios, ni espacios al inicio/final, ni espacios dobles
    const camposNombre = [
      { valor: estudiante.nombres, etiqueta: "nombres" },
      { valor: estudiante.apellidos, etiqueta: "apellidos" },
    ];

    for (const campo of camposNombre) {
      if (
        campo.valor.trim() === "" ||
        campo.valor !== campo.valor.trim() ||
        /\s{2,}/.test(campo.valor)
      ) {
        setError(`El campo ${campo.etiqueta} no puede estar vacío o espacios.`);
        return;
      }
    }

    // Validación de mayoría de edad (18 años o más)
    const [year, month, day] = estudiante.fechaNacimiento.split("-").map(Number);
    const fechaMayoriaEdad = new Date(year + 18, month - 1, day);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaMayoriaEdad > hoy) {
      setError("El estudiante debe tener al menos 18 años.");
      return;
    }

    // Validación de correo repetido (sin distinguir mayúsculas/minúsculas)
    // (se ignora al estudiante que se está editando)
    const correoRepetido = estudiantes.some(
      (est) =>
        est.cedula !== cedulaEditando &&
        est.correo.toLowerCase() === estudiante.correo.toLowerCase(),
    );

    if (correoRepetido) {
      setError("El correo ingresado ya está registrado.");
      return;
    }

    if (cedulaEditando) {
      // Reemplazar el estudiante actualizado en la lista
      setEstudiantes(
        estudiantes.map((est) => (est.cedula === cedulaEditando ? estudiante : est)),
      );
      setMensaje("Estudiante actualizado exitosamente.");
    } else {
      //Agregar el estudiante a la lista de estudiantes
      setEstudiantes([...estudiantes, estudiante]);
      setMensaje("Estudiante registrado exitosamente.");
    }

    // Cerrar la ventana modal y limpiar el formulario
    setEstudiante({ ...estudianteInicial });
    setCedulaEditando(null);
    setMostrarModal(false);
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold">
          <i className="bi bi-people me-2"></i>
          Estudiantes
        </h3>

        <p className="text-muted mb-0">Administración y registro de estudiantes</p>
      </div>

      {mensaje && (
        <div className="alert alert-success" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {mensaje}
        </div>
      )}

      {/* TABLA DE ESTUDIANTES */}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Estudiantes registrados
          </h5>

          <button type="button" className="btn btn-primary" onClick={abrirAgregar}>
            <i className="bi bi-person-plus me-2"></i>
            Agregar
          </button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Cédula</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Carrera</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {estudiantes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay estudiantes registrados.
                    </td>
                  </tr>
                ) : (
                  estudiantes.map((est) => (
                    <tr key={est.cedula}>
                      <td>{est.cedula}</td>
                      <td>{est.nombres}</td>
                      <td>{est.apellidos}</td>
                      <td>{est.correo}</td>
                      <td>{est.carrera}</td>
                      <td>{est.estado}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => abrirEditar(est)}
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
                <form onSubmit={grabarEstudiante} noValidate>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <i
                        className={`bi ${cedulaEditando ? "bi-pencil-square" : "bi-person-plus"} me-2`}
                      ></i>
                      {cedulaEditando ? "Actualizar estudiante" : "Registrar estudiante"}
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
                        <label htmlFor="cedula" className="form-label">Cédula</label>

                        {/* La cédula se bloquea cuando se está actualizando */}
                        <input
                          type="text"
                          id="cedula"
                          name="cedula"
                          className="form-control"
                          placeholder="Ingrese la cédula"
                          maxLength={10}
                          value={estudiante.cedula}
                          onChange={manejarCambio}
                          disabled={cedulaEditando !== null}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label">Fecha de nacimiento</label>

                        <input
                          type="date"
                          id="fechaNacimiento"
                          name="fechaNacimiento"
                          className="form-control"
                          value={estudiante.fechaNacimiento}
                          onChange={manejarCambio}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="nombres" className="form-label">Nombres</label>

                        <input
                          type="text"
                          id="nombres"
                          name="nombres"
                          className="form-control"
                          placeholder="Ingrese los nombres"
                          value={estudiante.nombres}
                          onChange={manejarCambio}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="apellidos" className="form-label">Apellidos</label>

                        <input
                          type="text"
                          id="apellidos"
                          name="apellidos"
                          className="form-control"
                          placeholder="Ingrese los apellidos"
                          value={estudiante.apellidos}
                          onChange={manejarCambio}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="correo" className="form-label">Correo electrónico</label>

                        <input
                          type="email"
                          id="correo"
                          name="correo"
                          className="form-control"
                          placeholder="correo@ejemplo.com"
                          value={estudiante.correo}
                          onChange={manejarCambio}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="carrera" className="form-label">Carrera</label>

                        <select
                          id="carrera"
                          name="carrera"
                          className="form-select"
                          value={estudiante.carrera}
                          onChange={manejarCambio}
                          required
                        >
                          <option value="">Seleccione una carrera</option>
                          <option value="Desarrollo de Software">Desarrollo de Software</option>
                          <option value="Administración">Administración</option>
                          <option value="Marketing">Marketing</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="estado" className="form-label">Estado</label>

                        <select
                          id="estado"
                          name="estado"
                          className="form-select"
                          value={estudiante.estado}
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
                      {cedulaEditando ? "Guardar cambios" : "Guardar"}
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

export default Estudiantes;
