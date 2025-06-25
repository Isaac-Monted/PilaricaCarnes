import * as globales from '../../js/global.js';
import * as funciones from '../../models/gestor.js';
// ========================== DOM ==========================
window.addEventListener("DOMContentLoaded", function(){
    console.log("gestor");
    CargarPagina();
});

// mapa con los campos del formulario
const gestorElemens = {
    filtroFechaInicio: document.getElementById("fechaInitF_gestor"),
    filtroFechaFinal: document.getElementById("fechaFinalF_gestor"),
    id_producto: document.getElementById("id_productoF_gestor"),
    filtroProducto: document.getElementById("productoF_gestor"),
    filtroProductoDestino: document.getElementById("productoDestinoF_gestor"),
    filtroMovimiento: document.getElementById("movimientoF_gestor"),
    filtroAgrupacion: document.getElementById("agrupacionF_gestor"),
    filtroEstado: document.getElementById("estadoF_gestor"),
    filtroOrientacion: document.getElementById("orientacionF_gestor")
}

const Lista = document.getElementById("listaResultadosGestor");

// ========================== EVENTOS ==========================
export function DetectarMovimiento(movimiento){
    console.log(movimiento);
    if(movimiento === "Inventario"){
        gestorElemens.filtroFechaFinal.disabled = true;
        gestorElemens.filtroProductoDestino.disabled = true;
        gestorElemens.filtroAgrupacion.disabled = true;
        gestorElemens.filtroEstado.disabled = true;
        gestorElemens.filtroOrientacion.disabled = true;
    } else {
        console.log("Normal")
        if(movimiento === "Cambios"){
            gestorElemens.filtroProductoDestino.disabled = false;
        } else {
            gestorElemens.filtroProductoDestino.disabled = true;
        }

        gestorElemens.filtroFechaFinal.disabled = false;
        gestorElemens.filtroAgrupacion.disabled = false;
        gestorElemens.filtroEstado.disabled = false;
        gestorElemens.filtroOrientacion.disabled = false;
    }
}

export function LimpiarGestor(){
    console.log("Limpiar");
    
    // limpiar cada una de las casillas
    Object.keys(gestorElemens).forEach(key => {
        const casilla = gestorElemens[key];
        casilla.value = "";
    });

    Lista.innerHTML = ''; // Limpiar el contenido de la lista

    // Actualizar la tabla
    LlenartablaGestor();
    DetectarMovimiento("Inventario");
}

export function FiltrarInformacion(){

}

export async function SeleccionarProducto(Texto){
    const movimiento = gestorElemens.filtroMovimiento.value
    if(movimiento === "" || movimiento ==="Inventario" || movimiento ==="Cambios"){
        const productosFiltrados = await globales.BuscarProductoText(Texto);
    funciones.LlenarListaConDatos(productosFiltrados);
    }
}

export function ColocarSeleccionEnCasillas(id_producto,nombre_producto){
    console.log(id_producto, nombre_producto);
    // colocar los datos en las casillas
    gestorElemens.id_producto.value = id_producto;
    gestorElemens.filtroProducto.value = nombre_producto;
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

export async function AplicarFiltros(){

}

function CargarPagina(){
    LlenarFiltroProductos();
    LlenartablaGestor();
}

// ========================== FUNCIONES ==========================
async function LlenarFiltroProductos(){
    // Traer todos los productos de la base de datos
    await fetch(`/../carnes/api/Productos.php?action=LeerProductos&filters=%7B%22estado%22%3A%22Activo%22%7D`)
        .then(respuesta => respuesta.json()) // Espera la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.ColocarProductosEnLista(data);
        })
        .catch(error => {
            console.error("Error al buscar productos:", error);
    });
}

async function LlenartablaGestor(){

}