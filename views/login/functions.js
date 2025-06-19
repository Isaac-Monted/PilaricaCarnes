
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

export function IniciarSesion() {

    document.location.href = '/carnes/inicio';
}

function CabiarModoUsuario(){
    //pedir la contraseña del administrador
    let nombre = prompt("Ingrese la contraseña del administrador");
    if(nombre){
        contador = 0;
        document.location.href = '/carnes/usuarios'
    } else {
        contador = 0;
    }
}