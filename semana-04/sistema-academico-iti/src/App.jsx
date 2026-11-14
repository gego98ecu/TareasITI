import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Estudiantes from "./pages/Estudiantes";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Materias from "./pages/Materias";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/inicio"
          element={
            <Layout>
              <Inicio />
            </Layout>
          }
        />

        <Route
          path="/estudiantes"
          element={
            <Layout>
              <Estudiantes />
            </Layout>
          }
        />

        <Route
          path="/materias"
          element={
            <Layout>
              <Materias />
            </Layout>
          }
        />

        <Route path="*"element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
