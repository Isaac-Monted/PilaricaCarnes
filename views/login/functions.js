import * as globales from '../../js/global.js';

// Contador para habilitar modo usuario
let contador = 0;

export function MostrarContrasena() {
    // Funsion del boton
    const Contrasena = document.getElementById("contrsena_login");
    if(Contrasena.type=="password"){
        Contrasena.type="text";
    } else{
        Contrasena.type="password";
    }

    // validar cambio de modo
    contador += 1;
    if (contador === 10){
        CabiarModoUsuario();
    }
}

export function LimpiarFormulario() {
    const Nombre = document.getElementById("usuario_login");
    const Contrasena = document.getElementById("contrsena_login");

    Nombre.value = "";
    Contrasena.value = "";
}

export async function IniciarSesion() {
    // buscar los datos del administrador
    const data = await globales.BuscarUsuarioText(document.getElementById("usuario_login").value.toUpperCase());
    
    if(data.error){
        // Lanzar un error si el estado HTTP no fue exitoso
        alert("No esta registrado el usuario registrado");
        LimpiarFormulario();
        return;
    }

    if(data[0].estado === "Inactivo"){
        // Lanzar un error si el estado HTTP no fue exitoso
        alert("El usuario no esta permitido");
        LimpiarFormulario();
        return;
    }
    
    // declarar la contraseña
    const contrasena = data[0].contrasena;

    // promesa para enviar los datos al servidor y esperar la coonfirmacion
    const responseData = await fetch('/../carnes/api/usuarios.php?action=Validacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            escrita: document.getElementById("contrsena_login").value,
            almacenada: contrasena
        })
    });

    // Verificar si la respuesta fue exitosa
    const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

    // mostrar el mensaje acorde a la respuesta del servidor
    if (respuesta.success){
        LimpiarFormulario();
        document.location.href = '/carnes/inicio';
    }else{
        console.error('Error:', respuesta.message);
        alert("Opps! esa no es la contraseña del usuario")
    }
}

async function CabiarModoUsuario(){
    //pedir la contraseña del administrador
    let nombre = prompt("Ingrese la contraseña del administrador");
    if(nombre){
        // reiniciar el contador
        contador = 0;
        
        // buscar los datos del administrador
        const data = await globales.BuscarUsuarioText('ADMIN');

        if(data.error){
            alert("No hay un administrador configurelo inmediatamente");
            await fetch('/../carnes/api/usuarios.php?action=Inicio');
            document.location.href = '/carnes/usuarios';
        }
        
        // declarar la contraseña
        const contrasena = data[0].contrasena;

        // promesa para enviar los datos al servidor y esperar la coonfirmacion
        const responseData = await fetch('/../carnes/api/usuarios.php?action=Validacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                escrita: nombre,
                almacenada: contrasena
            })
        });

        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostrar el mensaje acorde a la respuesta del servidor
        if (respuesta.success){
            document.location.href = '/carnes/usuarios';
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! esa no es la contraseña del usuario")
        }
    } else {
        //reiniciar el contador
        contador = 0;
    }
}