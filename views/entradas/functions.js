import * as funciones from '../../models/entradas.js';
// ========================== DOM ==========================
window.addEventListener("DOMContentLoaded", function(){
    console.log("entradas");
    Cargarpagina();
});

// mapa con los campos del formulario
const entradasElements = {
    filtroFecha: document.getElementById("fechaF_entradas"),
    filtroProductos: document.getElementById("productoF_entradas"),
    id: document.getElementById("id_entradas"),
    producto: document.getElementById("nombre_entradas"),
    id_producto: document.getElementById("id_producto"),
    cajas: document.getElementById("cajas_entradas"),
    kilosBru: document.getElementById("kilosB_entradas"),
    piezasExt: document.getElementById("piezasE_entradas"),
    destareAdd: document.getElementById("destareA_entradas"),
    totalPz: document.getElementById("totalP_entradas"),
    totalKg: document.getElementById("totalK_entradas"),
    observaciones: document.getElementById("Observaciones_entradas")
};

// declarar la lista que se va a llenar
const Lista = document.getElementById("listaResultadosEntradas");

// ========================== EVENTOS ==========================
export async function AgregarArticulo(){
    if(!entradasElements.filtroFecha.value){
        alert("por favor seleccione una fecha");
    }else if(!entradasElements.producto.value){
        alert("por favor seleccione un producto");
    } else{
        console.log("Agregar");
        // promesa para enviar los datos al servidor y esperar la confirmacion
    }
}

export function LimpiarArticulo(){
    console.log("Limpiar");

    // limpiar cada una de las casillas
    Object.keys(entradasElements).forEach(key => {
        const casilla = entradasElements[key];
        casilla.value = "";
    });

    Lista.innerHTML = ''; // Limpiar el contenido de la lista

    //Calcular los campos calculados
    CalcularCamposCalculados();
}

export function EditarArticulo(){
    console.log("Editar");
}

export function EliminarArticulo(){
    console.log("Eliminar");
}

export async function SeleccionarProducto(Texto){
    const productosFiltrados = await BuscarProductoText(Texto);
    funciones.LlenarListaConDatos(productosFiltrados);
}

export function ColocarSeleccionEnCasillas(id_producto, nombre_producto){
    console.log(id_producto, nombre_producto);
    // colocar los datos en las casillas
    entradasElements.id_producto.value = id_producto;
    entradasElements.producto.value = nombre_producto;
    Lista.innerHTML = ''; // Limpiar el contenido de la lista
}

export function focoCasilla(evento){
    if(evento===true){
        Lista.style.display = 'block'; // Asegurarse de que la lista esté oculta
    }else if(evento === false){
        Lista.style.display = 'none'; // Asegurarse de que la lista esté oculta
    }else{
        Lista.innerHTML = ''; // Limpiar el contenido de la lista
    }
}

function Cargarpagina(){
    LlenarFiltroProductos();
    LlenartablaEntradas();
    CalcularCamposCalculados();
}

// ========================== FUNCIONES ==========================
async function LlenarFiltroProductos(){
    // Traer todos los productos de la base de datos
    await fetch(`/../carnes/api/Productos.php?action=LeerProductos`)
        .then(respuesta => respuesta.json()) // Espera la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.ColocarProductosEnLista(data);
        })
        .catch(error => {
            console.error("Error al buscar productos:", error);
    });
}

function LlenartablaEntradas(){

}

export async function CalcularCamposCalculados(){
    console.log("calculando");
    if(!entradasElements.cajas.value && !entradasElements.kilosBru.value && !entradasElements.piezasExt.value && !entradasElements.destareAdd.value){
        // Colocar las casillas en cero
        entradasElements.totalPz.value = 0.00;
        entradasElements.totalKg.value = 0.00;
    } else {
        // Declarar las casillas que se utilizan
        let cajas = parseFloat(entradasElements.cajas.value) || 0;
        let kilosBrutos = parseFloat(entradasElements.kilosBru.value) || 0;
        let piezasExtra = parseFloat(entradasElements.piezasExt.value) || 0;
        let destareAdicional = parseFloat(entradasElements.destareAdd.value) || 0;
        // Buscar cuantas piezas tiene cada caja de producto
        const DataProd = await BuscarProductoId(entradasElements.id.value);
        let piezasCaja = 0;
        if(!DataProd){
            piezasCaja = DataProd.piezas_x_caja;
        }

        //console.log(piezasCaja);
        // Calcular los totales
        const TotalPiezas = (cajas * piezasCaja) + piezasExtra;
        const TotalKilos = kilosBrutos - (cajas * 2.4) - destareAdicional;
        // Colocar los resultados
        entradasElements.totalPz.value = TotalPiezas;
        entradasElements.totalKg.value = TotalKilos.toFixed(2);

    }
}

async function BuscarProductoId(id_prod){
    // Construir el objeto de filtros
    const filters = {
        id: id_prod,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerProductos'); // Siempre añadir la acción


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

        //console.log(data);
        return data;

    } catch (error) {
        console.error("Error al buscar productos:", error);
        // Podrías retornar un array vacío o null aquí si hay un error
        return [];
    }
}

async function BuscarProductoText(Product_text){
    // Construir el objeto de filtros
    const filters = {
        nombre_producto_buscar: Product_text,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerProductos'); // Siempre añadir la acción

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

        return data;

    } catch (error) {
        console.error("Error al buscar productos:", error);
        // Podrías retornar un array vacío o null aquí si hay un error
        return [];
    }
}
