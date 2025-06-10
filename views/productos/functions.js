// ========================== DOM ==========================
window.addEventListener("DOMContentLoaded", function(){
    console.log("productos");
});

// ========================== EVENTOS ==========================
export async function AgregarProductos(){
    // mapa con los campos del formulario
    const productosElements = {
        id: document.getElementById("id_productos"),
        producto: document.getElementById("producto_productos"),
        descripcion: document.getElementById("descripcion_productos"),
        clave: document.getElementById("clave_productos"),
        presentacion: document.getElementById("presentacion_productos"),
        pesoXpz: document.getElementById("pesoXpz_productos"),
        piezaXcja: document.getElementById("piezaXcja_productos"),
        precio: document.getElementById("precio_productos"),
        piezasInit: document.getElementById("piezasInit_productos"),
        kilosInit: document.getElementById("kilosInit_productos"),
        estado: document.getElementById("estado_productos")
    };

    if(!productosElements.producto.value){
        alert("No hay producto");
    }else{
        console.log("Agregar");
         // promesa para enviar los datos al servidor y esperar la coonfirmacion
        const responseData = await fetch(`/../carnes/api/Productos.php?action=AgregarProducto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                producto: productosElements.producto.value,
                descripcion: productosElements.descripcion.value,
                clave: productosElements.clave.value,
                presentacion: productosElements.presentacion.value,
                pesoXpieza: productosElements.pesoXpz.value,
                piezaXcaja: productosElements.piezaXcja.value,
                precio: productosElements.precio.value,
                piezasIniciales: productosElements.piezasInit.value,
                kilosIniciales: productosElements.kilosInit.value,
                estado: productosElements.estado.value
            })
        });
        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostrar el mensaje acorde a la respuesta del servidor
        if (respuesta.success){
            console.log('Respuesta:', resultCorreo.message);
            alert("Se ha agregado correctamentre");
            LimpiarProductos();
        }else{
            console.error('Error:', resultCorreo.message);
            alert("Opps! No se agrego el producto")
        }
    }
}

export function LimpiarProductos(){
    console.log("Limpiar");
    // mapa con los campos del formulario
    const productosElements = {
        id: document.getElementById("id_productos"),
        producto: document.getElementById("producto_productos"),
        descripcion: document.getElementById("descripcion_productos"),
        clave: document.getElementById("clave_productos"),
        presentacion: document.getElementById("presentacion_productos"),
        pesoXpz: document.getElementById("pesoXpz_productos"),
        piezaXcja: document.getElementById("piezaXcja_productos"),
        precio: document.getElementById("precio_productos"),
        piezasInit: document.getElementById("piezasInit_productos"),
        kilosInit: document.getElementById("kilosInit_productos"),
        estado: document.getElementById("estado_productos")
    };

    // limpiar cada una de las casillas
    Object.keys(productosElements).forEach(key => {
        const casilla = productosElements[key];
        casilla.value = "";
    });
}

export function EditarProductos(){
    console.log("Ediatr");
}

export function EliminarProductos(){
    console.log("Eliminar");
}

export function FitroBuscarProducto(texto){

}

// ========================== FUNCIONES ==========================