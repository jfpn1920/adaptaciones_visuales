// ===== REFERENCIAS A LOS ELEMENTOS DEL HTML =====
const lectura = document.getElementById('lectura');          // texto que se adapta
const porcentajeTexto = document.getElementById('porcentaje');
const btnMenos = document.getElementById('btnMenos');
const btnMas = document.getElementById('btnMas');
const btnRestablecer = document.getElementById('btnRestablecer');
const botonesTema = document.querySelectorAll('.tema');      // Claro / Oscuro / Contraste
const checkInterlineado = document.getElementById('interlineado');
// ===== CONSTANTES DEL TAMAÑO DEL TEXTO =====
const MINIMO = 70;    // tamaño mínimo permitido (%)
const MAXIMO = 200;   // tamaño máximo permitido (%)
const PASO = 10;      // cuánto cambia cada vez (%)
// ===== CLAVE DE LOCALSTORAGE =====
const CLAVE = 'adaptaciones_estado';
// ===== ESTADO POR DEFECTO =====
// porcentaje: tamaño del texto | tema: colores | interlineado: true o false
const estadoInicial = { porcentaje: 100, tema: 'claro', interlineado: false };
// ===== LEER EL ESTADO GUARDADO =====
function leerEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE);
        // Si hay datos guardados los usamos; si no, partimos del estado inicial
        return guardado ? { ...estadoInicial, ...JSON.parse(guardado) } : { ...estadoInicial };
    } catch (error) {
      return { ...estadoInicial }; // si algo falla, empezamos desde cero
    }
}
// Al cargar la página recuperamos las preferencias guardadas
let estado = leerEstado();
// ===== GUARDAR EL ESTADO =====
// Guarda las preferencias como texto en localStorage
function guardarEstado() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
}
// ===== CAMBIAR EL TAMAÑO DEL TEXTO =====
// cambio vale +10 para aumentar o -10 para disminuir
function cambiarTamano(cambio) {
    const nuevo = estado.porcentaje + cambio;
    // Math.min y Math.max impiden salirse de los límites
    estado.porcentaje = Math.max(MINIMO, Math.min(MAXIMO, nuevo));
    guardarEstado();
    aplicarEstado();
}
// ===== CAMBIAR EL TEMA DE COLORES =====
function cambiarTema(tema) {
    estado.tema = tema;
    guardarEstado();
    aplicarEstado();
}
// ===== ACTIVAR O DESACTIVAR EL INTERLINEADO AMPLIO =====
function cambiarInterlineado() {
    estado.interlineado = checkInterlineado.checked;
    guardarEstado();
    aplicarEstado();
}
// ===== VOLVER AL TAMAÑO NORMAL =====
function restablecerTamano() {
    estado.porcentaje = estadoInicial.porcentaje;
    guardarEstado();
    aplicarEstado();
}
// ===== APLICAR EL ESTADO A LA PANTALLA =====
// Esta función hace visibles todos los cambios
function aplicarEstado() {
    // El CSS usa la variable --escala (1 = 100%, 1.5 = 150%, etc.)
    lectura.style.setProperty('--escala', estado.porcentaje / 100);
    // El atributo data-tema activa los colores definidos en el CSS
    document.body.dataset.tema = estado.tema;
    // Agrega o quita la clase del interlineado amplio
    lectura.classList.toggle('amplio', estado.interlineado);
    checkInterlineado.checked = estado.interlineado;
    // Muestra el porcentaje actual
    porcentajeTexto.textContent = estado.porcentaje + '%';
    // Desactiva los botones cuando llegan al límite
    btnMenos.disabled = estado.porcentaje <= MINIMO;
    btnMas.disabled = estado.porcentaje >= MAXIMO;
    // Marca como activo el botón del tema elegido
    botonesTema.forEach(boton => {
        boton.classList.toggle('activo', boton.dataset.tema === estado.tema);
    });
}
// ===== EVENTOS =====
btnMenos.addEventListener('click', () => cambiarTamano(-PASO));  // disminuir
btnMas.addEventListener('click', () => cambiarTamano(PASO));     // aumentar
btnRestablecer.addEventListener('click', restablecerTamano);
checkInterlineado.addEventListener('change', cambiarInterlineado);
// Cada botón de tema aplica el tema que indica su atributo data-tema
botonesTema.forEach(boton => {
    boton.addEventListener('click', () => cambiarTema(boton.dataset.tema));
});
// ===== INICIO: se ejecuta al cargar o refrescar la página =====
aplicarEstado();