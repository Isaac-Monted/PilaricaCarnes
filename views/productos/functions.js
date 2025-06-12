import * as funciones from '../../models/productos.js';
// ========================== DOM ==========================
window.addEventListener("DOMContentLoaded", function(){
    console.log("productos");
    CargarPagina();
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

    CargarPagina();
}

export function EditarProductos(){
    console.log("Ediatr");
}

export function EliminarProductos(){
    console.log("Eliminar");
}

export async function FitroBuscarProducto(texto){
    // Construir el objeto de filtros
    const filters = {
        nombre_producto_buscar: texto,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerProductos'); // Siempre añadir la acción

    // Añadir el filtro específico (o filtros)
    /* for (const key in filters) {
        if (filters.hasOwnProperty(key)) { // Buena práctica para asegurar que la propiedad es propia del objeto
            params.append(key, filters[key]);
        }
    } */

    // COMIENZO DEL CAMBIO CLAVE: Codificar el objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Envía todo el objeto filters como una cadena JSON

    // Construir la URL completa usando template literals y params.toString()
    const url = `/../carnes/api/Productos.php?${params.toString()}`;
    //                                         ^ Solo un '?' aquí

    // Realizar la solicitud fetch
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
        console.error("Error al buscar productos:", error);
        // Podrías retornar un array vacío o null aquí si hay un error
        return [];
    }
}

async function CargarPagina(){
    // Traer todos los productos de la base de datos
    await fetch(`/../carnes/api/Productos.php?action=LeerProductos`)
        .then(respuesta => respuesta.json()) // Espera la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.LlenarTabla(data);
        })
        .catch(error => {
            console.error("Error al buscar productos:", error);
    });
}
// ========================== FUNCIONES ==========================