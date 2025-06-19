import * as funciones from '../../models/usuarios.js';
// ========================== DOM ==========================
window.addEventListener("DOMContentLoaded", function(){
    console.log("usuarios");
    CargarPagina();
});
// mapa con los campos del formulario
const usuariosElements = {
    filtroTexto: document.getElementById("usuariosF_usuarios"),
    id: document.getElementById("id_usuarios"),
    usuario: document.getElementById("usuario_usuarios"),
    nombre: document.getElementById("nombre_usuarios"),
    apellidoP: document.getElementById("apellidoP_usuarios"),
    apellidoM: document.getElementById("apellidoM_usuarios"),
    contrasena: document.getElementById("contrasena_usuarios"),
    correo: document.getElementById("correo_usuarios"),
    telefono: document.getElementById("telefono_usuarios"),
    estado: document.getElementById("estado_usuarios")
}

// ========================== EVENTOS ==========================
export async function AgregarUsuario(){

}

export function LimpiarUsuarios(){
    console.log("Limpiar");
    
    // limpiar cada una de las casillas
    Object.keys(usuariosElements).forEach(key => {
        const casilla = usuariosElements[key];
        casilla.value = "";
    });

    LlenartablaUsuarios();
}

export async function EditarUsuario(){

}

export async function EliminarUsuario(){

}

export async function FitroBuscarUsuario(texto){
    // Construir el objeto de filtros
    const filters = {
        nombre_usuario_buscar: texto,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerUsuarios'); // Siempre añadir la acción

    // Codificar el objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Envía todo el objeto filters como una cadena JSON

    // Construir la URL completa usando template literals y params.toString()
    const url = `/../carnes/api/usuarios.php?${params.toString()}`;

    // Realizar la solicitud Ajax
    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Lanzar un error si el estado HTTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Esperar a que el JSON se parseé

        console.log(data);
        funciones.LlenarTabla(data);

    } catch (error) {
        console.error("Error al buscar usuario:", error);
        // retornar un array vacío o null aquí si hay un error
        return [];
    }
}

export function MostrarContrasena() {
    // Funsion del boton
    const Contrasena = document.getElementById("contrasena_usuarios");
    if(Contrasena.type=="password"){
        Contrasena.type="text";
    } else{
        Contrasena.type="password";
    }
}

async function CargarPagina(){
    LlenartablaUsuarios();
    
}
// ========================== FUNCIONES ==========================
async function LlenartablaUsuarios(){
    // Traer todos los productos de la base de datos
    await fetch(`/../carnes/api/usuarios.php?action=LeerUsuarios`)
        .then(respuesta => respuesta.json()) // Espera la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.LlenarTabla(data);
        })
        .catch(error => {
            console.error("Error al buscar productos:", error);
    });
}

export async function ColocarDatosEnCasillas(id_prod){

}