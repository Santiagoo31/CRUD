const url = 'https://jsonplaceholder.typicode.com/todos?userId=1';
const input = document.getElementById('tareaInput');
const formulario = document.getElementById('formularioTarea');
const lista = document.getElementById('listaTareas');
const alerta = document.getElementById('mensajeAlerta');

function mostrarAlerta(texto, tipo) {
    alerta.innerText = texto;
    alerta.className = `alerta ${tipo}`;
    setTimeout(() => alerta.className = 'alerta oculto', 3000);
}

// Renderizar modificado por Compañero 2 (Incluye botón Eliminar)
function renderizarTareaEnDOM(tarea) {
    let li = document.createElement('li');
    li.innerHTML = `<span>${tarea.title}</span>`;
    
    let contenedorBotones = document.createElement('div');

    // --- CÓDIGO NUEVO COMPAÑERO 2 ---
    let btnEliminar = document.createElement('button');
    btnEliminar.innerText = 'Eliminar';
    btnEliminar.style.backgroundColor = '#dc3545';
    btnEliminar.style.marginLeft = '5px';
    btnEliminar.style.color = 'white';
    btnEliminar.style.border = 'none';
    btnEliminar.style.padding = '5px 10px';
    btnEliminar.style.borderRadius = '4px';
    btnEliminar.style.cursor = 'pointer';
    btnEliminar.onclick = () => eliminarTarea(tarea.id, li);
    contenedorBotones.appendChild(btnEliminar);
    // ---------------------------------

    li.appendChild(contenedorBotones);
    lista.appendChild(li);
}

function obtenerTareas() {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(datos => {
            lista.innerHTML = '';
            datos.slice(0, 5).forEach(tarea => renderizarTareaEnDOM(tarea));
        })
        .catch(() => mostrarAlerta('Error de red: No se pudieron cargar las tareas', 'error'));
}

function crearTarea(evento) {
    evento.preventDefault();
    
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

// --- FUNCIÓN NUEVA COMPAÑERO 2 ---
function eliminarTarea(id, elementoHTML) {
    let confirmar = confirm("¿Estás seguro de que deseas eliminar esta tarea?");
    if (!confirmar) return;

    fetch('https://jsonplaceholder.typicode.com/todos/' + id, {
        method: 'DELETE'
    })
    .then(res => {
        if (!res.ok) throw new Error();
        elementoHTML.remove(); 
        mostrarAlerta('Tarea eliminada correctamente', 'exito');
    })
    .catch(() => mostrarAlerta('Hubo un inconveniente al intentar eliminar la tarea', 'error'));
}