
export async function CerrarSesion(){
    console.log("cerrado");
    try {
        const respuesta = await fetch(`/../carnes/api/usuarios.php?action=CerrarSesion`);
        const data = await respuesta.json();

        // mostrar el mensaje acorde a la respuesta del servidor
        if (data.success){
            document.location.href = '/carnes/';
        }else{
            console.error('Error:', data.message);
            alert("Opps! no se ha podido cerrar sesion")
        }

    } catch (error) {
        console.error("Error al cerrar sesion:", error);
        return null;
    }
}