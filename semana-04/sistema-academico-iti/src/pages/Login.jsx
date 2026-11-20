import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Credenciales de acceso (solo para demostración, no hay base de datos de usuarios)
const CORREO_VALIDO = "correo@iti.edu.ec";
const CLAVE_VALIDA = "012345";

function Login() {
  const navigate = useNavigate();

  // Estados de los campos del formulario y del mensaje de error
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  // Valida los datos y, si son correctos, ingresa al sistema
  const ingresar = (e) => {
    e.preventDefault();

    setError("");

    // Validación de campos obligatorios
    if (!correo || !clave) {
      setError("Por favor, ingrese el correo y la contraseña.");
      return;
    }

    // Valida el formato del correo (texto@texto.dominio)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("El correo electrónico no tiene un formato válido.");
      return;
    }

    // Valida las credenciales (el correo sin distinguir mayúsculas/minúsculas)
    if (correo.toLowerCase() !== CORREO_VALIDO || clave !== CLAVE_VALIDA) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    navigate("/inicio");
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center p-3">
      <div className="card login-card p-4">
        <div className="card-body">
          <div className="login-logo">
            <i className="bi bi-mortarboard-fill"></i>
          </div>

          <h3 className="login-title text-center mb-2">Sistema Académico</h3>

          <h5 className="text-center text-secondary mb-4">Instituto Tecnológico ITI</h5>

          <p className="text-center text-muted mb-4">Ingrese sus credenciales para continuar</p>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {/* noValidate desactiva la validación del navegador para que se vean nuestros mensajes */}
          <form onSubmit={ingresar} noValidate>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">
                Correo electrónico
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>

                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  placeholder="correo@iti.edu.ec"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="clave" className="form-label">
                Contraseña
              </label>

              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>

                <input
                  type="password"
                  className="form-control"
                  id="clave"
                  placeholder="Ingrese su contraseña"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Ingresar al sistema
            </button>
          </form>

          <hr className="my-4" />

          <p className="text-center text-muted small mb-0">© 2026 ITI - Sistema Académico</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
