import { ColocarDatosEnCasillas, LimpiarUsuarios } from '../views/usuarios/functions.js';

export function LlenarTabla(users){
    const Tabla = document.getElementById("contenedorTablaUsuarios");// El contenedor donde se mostrarán la tabla
    Tabla.innerHTML = ''; // Limpiar el contenedor para agregar la informacion

    // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (users.error) {
        const errorRow = document.createElement("tr"); // Crear la fila en blanco en caso de error
        errorRow.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        Tabla.appendChild(errorRow); // Mostrar el mensaje de error en el DOM
        return;
    }

    // Si no hay usuarios, mostrar un mensaje adecuado
    if (users.length === 0) {
        const nouserRow = document.createElement("tr"); // Crear la fila en blanco en caso de no haber usuarios
        nouserRow.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        Tabla.appendChild(nouserRow);
        return;
    }

    // Recorrer los usuarios y crear elementos para mostrarlos
    users.forEach(user => {
        const userTable = document.createElement("tr"); // Crear una fila para cada fila retornada
        // Agregar contenido a la tarjeta del usero
        userTable.innerHTML = `
            <td style="display: none">${user.id}</td>
            <td>${user.usuario}</td>
            <td>${user.nombre}</td>
            <td>${user.primer_apellido}</td>
            <td>${user.segundo_apellido}</td>
            <td>${user.correo}</td>
            <td>${user.telefono}</td>
            <td>${user.estado}</td>
        `;

        Tabla.appendChild(userTable);

        // Agregar un evento para cada una de las filas
        userTable.addEventListener('click', () => {
            ColocarDatosEnCasillas(user.id);
        });
    });
}

export async function ColocarDatos(Datos, userElements){
    if (Datos.error){
        LimpiarUsuarios();
        return;
    }

    if (Datos.length === 0){
        LimpiarUsuarios();
        return;
    }

    for (const dato of Datos) {
        console.log(dato);

        let correoDecrypt = await desencriptar_informacion(dato.correo);
        let telefonoDecrypt = await desencriptar_informacion(dato.telefono);

        userElements.id.value = dato.id;
        userElements.usuario.value = dato.usuario;
        userElements.nombre.value = dato.nombre;
        userElements.apellidoP.value = dato.primer_apellido;
        userElements.apellidoM.value = dato.segundo_apellido ;
        userElements.contrasena.value = dato.contrasena;
        userElements.correo.value = correoDecrypt;
        userElements.telefono.value = telefonoDecrypt;
        userElements.estado.value = dato.estado;
    };
}

async function desencriptar_informacion(encriptado){
    try {
        const respuesta = await fetch(`/../carnes/api/usuarios.php?action=Desencriptar&encriptado=${encriptado}`);
        const data = await respuesta.json();
        console.log("Desencriptado:", data);
        return data; // Retornar las palabras desencriptadas
    } catch (error) {
        console.error("Error al desencriptar información:", error);
        return null;
    }
}