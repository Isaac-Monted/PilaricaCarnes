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
    if(!usuariosElements.usuario.value || !usuariosElements.nombre.value || !usuariosElements.apellidoP.value){
        alert("por favor seleccione un usuario");
        return;
    }else{
        console.log("Agregar");
            // promesa para enviar los datos al servidor y esperar la coonfirmacion
        const responseData = await fetch(`/../carnes/api/usuarios.php?action=AgregarUsuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                usuario: usuariosElements.usuario.value.toUpperCase(),
                nombre: usuariosElements.nombre.value,
                apellido_paterno: usuariosElements.apellidoP.value,
                apellido_materno: usuariosElements.apellidoM.value,
                contrasena: usuariosElements.contrasena.value,
                correo: usuariosElements.correo.value,
                telefono: usuariosElements.telefono.value,
                estado: usuariosElements.estado.value
            })
        });
        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostrar el mensaje acorde a la respuesta del servidor
        if (respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha agregado correctamentre");
            LimpiarUsuarios();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se agrego el usuario");
        }
    }
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
    if(!usuariosElements.usuario.value || !usuariosElements.id.value){
        alert("por favor seleccione un usuario");
        return;
    }else{
        console.log("Editar");
            // promesa para enviar los datos al servidor y esperar la confirmacion
        const responseData = await fetch(`/../carnes/api/usuarios.php?action=EditarUsuario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: usuariosElements.id.value,
                usuario: usuariosElements.usuario.value.toUpperCase(),
                nombre: usuariosElements.nombre.value,
                apellido_paterno: usuariosElements.apellidoP.value,
                apellido_materno: usuariosElements.apellidoM.value,
                contrasena: usuariosElements.contrasena.value,
                correo: usuariosElements.correo.value,
                telefono: usuariosElements.telefono.value,
                estado: usuariosElements.estado.value
            })
        });
        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostrar el mensaje acorde a la respuesta del servidor
        if (respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha editado correctamentre");
            LimpiarUsuarios();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se a editado el usuario");
        }
    }
}

export async function EliminarUsuario(){
    // declarar la casilla con el id a eliminar
    const idCasilla = usuariosElements.id
    if(!idCasilla.value){
        alert("por favor seleccione un usuario");
        return;
    }
    let confirmar = confirm("Esta seguro de eliminar el usuario");

    if(confirmar){
        console.log("Eliminar");
        // promesa para enviar los datos al servidor y esperar la coonfirmacion
        const responseData = await fetch('/../carnes/api/usuarios.php?action=EliminarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: idCasilla.value
            })
        });

        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostrar el mensaje acorde a la respuesta del servidor
        if (respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha eliminado correctamentre");
            LimpiarUsuarios();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se eliminado el usuario")
        }
    }
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
    // Traer todos los usuarios de la base de datos
    await fetch(`/../carnes/api/usuarios.php?action=LeerUsuarios`)
        .then(respuesta => respuesta.json()) // Espera la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.LlenarTabla(data);
        })
        .catch(error => {
            console.error("Error al buscar usuarios:", error);
    });
}

export async function ColocarDatosEnCasillas(id_user){
    console.log(`fila con id: ${id_user}`)
    
    // Construir el objeto de filtros
    const filters = {
        id: id_user,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerUsuarios'); // Siempre añadir la acción


    // COMIENZO DEL CAMBIO CLAVE: Codificar el objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Envía todo el objeto filters como una cadena JSON

    // Construir la URL completa usando template literals y params.toString()
    const url = `/../carnes/api/usuarios.php?${params.toString()}`;

    // Realizar la solicitud fetch
    try {
        const response = await fetch(url);

        if (!response.ok) {
            // Lanzar un error si el estado HTTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Esperar a que el JSON se parseé

        console.log(data);
        funciones.ColocarDatos(data, usuariosElements);

    } catch (error) {
        console.error("Error al buscar usuarios:", error);
        // Podras retornar un array vacío o null aquí si hay un error
        return [];
    }
}