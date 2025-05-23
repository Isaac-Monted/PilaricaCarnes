
export function MostrarContrasena() {
    const Contrasena = document.getElementById("contrsena_login");
    if(Contrasena.type=="password"){
        Contrasena.type="text";
    } else{
        Contrasena.type="password";
    }
}

export function LimpiarFormulario() {
    const Nombre = document.getElementById("usuario_login");
    const Contrasena = document.getElementById("contrsena_login");

    Nombre.value = "";
    Contrasena.value = "";
}

export function IniciarSesion() {

    document.location.href = '/carnes/inicio'
}