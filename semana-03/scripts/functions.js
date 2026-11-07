function cambiarTitulo() {
  const titulo = document.getElementById("titulo");
  titulo.textContent = "¡El título cambió!";
}

function cambiarTexto() {
  const texto = document.getElementById("texto");
  texto.textContent = "Nuevo texto con textContent";
}

function cambiarHTML() {
  const texto = document.getElementById("texto");
  texto.innerHTML = "Nuevo <strong>texto</strong> con innerHTML";
}

function agregarParrafo() {
  const parrafo = document.createElement("p");
  parrafo.textContent = "Párrafo nuevo";
  const contenedor = document.getElementById("contenedor");
  contenedor.appendChild(parrafo);
}

function eliminarParrafo() {
  const parrafo = document.getElementById("miParrafo");
  if (parrafo) {
    parrafo.remove();
  }
}
