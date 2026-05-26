// Filtramos por userId=1 para simular el contexto del usuario identificado
const url = 'https://jsonplaceholder.typicode.com/todos?userId=1';
const input = document.getElementById('tareaInput');
const formulario = document.getElementById('formularioTarea');
const lista = document.getElementById('listaTareas');
const alerta = document.getElementById('mensajeAlerta');

// Función reutilizable para mostrar mensajes al usuario (RNF-03)
function mostrarAlerta(texto, tipo) {
    alerta.innerText = texto;
    alerta.className = `alerta ${tipo}`; // Cambia las clases CSS dinámicamente
    setTimeout(() => alerta.className = 'alerta oculto', 3000); // Se oculta a los 3 segundos
}

// RF-01: Pintar tareas en el DOM
function renderizarTareaEnDOM(tarea) {
    let li = document.createElement('li');
    li.innerHTML = `<span>${tarea.title}</span>`;
    
    let contenedorBotones = document.createElement('div');
    // Los botones de actualizar y eliminar se quedan vacíos por ahora para tus compañeros
    
    li.appendChild(contenedorBotones);
    lista.appendChild(li);
}

// RF-01: Obtener tareas del usuario de la API
function obtenerTareas() {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(); // Si el servidor falla, salta al catch
            return res.json();
        })
        .then(datos => {
            lista.innerHTML = '';
            // Mostramos solo las primeras 5 tareas de este usuario
            datos.slice(0, 5).forEach(tarea => renderizarTareaEnDOM(tarea));
        })
        .catch(() => mostrarAlerta('Error de red: No se pudieron cargar las tareas', 'error'));
}

// RF-02: Crear Tarea con validaciones
function crearTarea(evento) {
    evento.preventDefault();
    
    // Validación de campos vacíos (RF-02 / RNF-02)
    if (input.value.trim() === '') {
        mostrarAlerta('El campo de texto está vacío. Por favor escribe una tarea.', 'error');
        return;
    }

    let nuevaTarea = { title: input.value, completed: false, userId: 1 };

    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(nuevaTarea),
        headers: { 'Content-type': 'application/json' }
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(tareaCreada => {
        renderizarTareaEnDOM(tareaCreada);
        mostrarAlerta('¡Tarea registrada exitosamente!', 'exito');
        input.value = '';
    })
    .catch(() => mostrarAlerta('No se pudo guardar la tarea en el servidor', 'error'));
}

formulario.onsubmit = crearTarea;
obtenerTareas();