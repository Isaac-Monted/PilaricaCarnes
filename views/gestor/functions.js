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
    console.log("Filtrado");
    // construir el objeto con filtros
    const filters = {};
    // Validar si hay un movimiento seleccionado
    if(gestorElemens.filtroMovimiento.value === ""){
        alert("Por favor selecciona un movimiento para filtrar");
        return;
        // determinar que filtros estan activos para armal la conslulta
    }else if(gestorElemens.filtroMovimiento.value === "Inventario"){
        // Colocar los filtros que son unicamente del inventario
        if(gestorElemens.filtroFechaInicio.value){
            filters["fecha"] = gestorElemens.filtroFechaInicio.value;
        }
        if(gestorElemens.id_producto.value){
            filters["producto_id"] = gestorElemens.id_producto.value;
        }
        // llamar a la API para gestionar el inventario
        console.log(filters);
        return;
    } else {
        // colocar la fecha inicial y la fecha de termino
        if(gestorElemens.filtroFechaInicio.value){
            filters["fecha_inicio"] = gestorElemens.filtroFechaInicio.value;
        }
        if(gestorElemens.filtroFechaFinal.value){
            filters["fecha_termino"] = gestorElemens.filtroFechaFinal.value;
        }

        // determinar si es entrada o cambio para gestionar que datos enviar
        if(gestorElemens.filtroMovimiento.value === "Cambios"){
            if(gestorElemens.id_producto.value){
                filters["producto_origen"] = gestorElemens.id_producto.value;
            }
            if(gestorElemens.filtroProductoDestino.value){
                filters["producto_destino"] = gestorElemens.filtroProductoDestino.value;
            }
        } else {
            if(gestorElemens.filtroProducto.value){
                filters["producto_texto"] = gestorElemens.filtroProducto.value;
            }
        }
        // Colocar los demas filtros compatibles con todos los movimientos
        if(gestorElemens.filtroAgrupacion.value){
            filters["agrupacion"] = gestorElemens.filtroAgrupacion.value;
        }
        if(gestorElemens.filtroEstado.value){
            filters["estado"] = gestorElemens.filtroEstado.value;
        }
        if(gestorElemens.filtroOrientacion.value){
            filters["orientacion"] = gestorElemens.filtroOrientacion.value;
        }

        // llamar a la API para gestionar la informacion
        switch(gestorElemens.filtroMovimiento.value){
            case "Cambios":
                console.log(filters);
                return;
            case "Entradas":
                console.log(filters);
                return;
            case "Salidas":
                console.log(filters);
                return;
        }
    }
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