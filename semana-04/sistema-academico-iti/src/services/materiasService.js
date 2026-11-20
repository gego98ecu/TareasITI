import axios from "axios";

// Configuración base de Axios
// La URL se toma de la variable de entorno VITE_API_URL (archivo .env)
// Si no existe, se usa la URL del servidor del docente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://backend-academico-iti.onrender.com/api",
  // 30 segundos: el servidor en Render puede tardar en "despertar"
  timeout: 30000,
});

// Funciones para consumir la API de materias
// Todas son asíncronas (async/await) y devuelven los datos de la respuesta
export const materiasService = {
  // GET /materias -> consulta todas las materias
  listar: async () => (await api.get("/materias")).data,

  // POST /materias -> registra una materia nueva
  crear: async (materia) => (await api.post("/materias", materia)).data,

  // PUT /materias/:codigo -> actualiza una materia
  modificar: async (codigo, materia) =>
    (await api.put(`/materias/${encodeURIComponent(codigo)}`, materia)).data,

  // DELETE /materias/:codigo -> elimina una materia
  eliminar: async (codigo) =>
    (await api.delete(`/materias/${encodeURIComponent(codigo)}`)).data,
};
