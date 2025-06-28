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
    LlenartablaGestor(null,null);
    DetectarMovimiento("Inventario");
}

export async function FiltrarInformacion(){
    console.log("Filtrado");
    // Constantes del tipo de movimiento
    const movimiento = gestorElemens.filtroMovimiento.value;
    let data = null;
    // construir el objeto con filtros
    const filters = {};
    // Validar si hay un movimiento seleccionado
    if(movimiento === ""){
        alert("Por favor selecciona un movimiento para filtrar");
        return;
        // determinar que filtros estan activos para armal la conslulta
    }else if(movimiento === "Inventario"){
        // Colocar los filtros que son unicamente del inventario
        if(gestorElemens.filtroFechaInicio.value){
            filters["fecha"] = gestorElemens.filtroFechaInicio.value;
        }
        if(gestorElemens.id_producto.value){
            filters["producto_id"] = gestorElemens.id_producto.value;
        }
        // llamar a la API para gestionar el inventario
        //console.log(filters);
        data = await ExecuteApiRest('CalcularInventario','/../carnes/api/gestor.php?',filters);
        LlenartablaGestor(data,movimiento); // Llamar a la funcion para llenar la tabla
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
        if(movimiento === "Cambios"){
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
        switch(movimiento){
            case "Cambios":
                //console.log(filters);
                data = await ExecuteApiRest('FiltarCambios','/../carnes/api/gestor.php?',filters);
                LlenartablaGestor(data,movimiento); // Llamar a la funcion para llenar la tabla
                return;
            case "Entradas":
                //console.log(filters);
                data = await ExecuteApiRest('FiltarEntradas','/../carnes/api/gestor.php?',filters);
                LlenartablaGestor(data,movimiento); // Llamar a la funcion para llenar la tabla
                return;
            case "Salidas":
                //console.log(filters);
                data = await ExecuteApiRest('FiltarSalidas','/../carnes/api/gestor.php?',filters);
                LlenartablaGestor(data,movimiento); // Llamar a la funcion para llenar la tabla
                return;
        }
    }
}

async function ExecuteApiRest(action, api, filters){
    // Crear un objeto URLSearchParams y añadir los fitros
    const params = new URLSearchParams();
    params.append('action', action.toString()); // Siempre añadir la accion

    // Codificar el objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Enviar todo el objeto filters como una cadena JSON

    //Construir la url completa usando template literals y params.tostring()
    const url = `${api.toString()}${params.toString()}`;

    // Realizar la solicitud Ajax
    try{
        const response = await fetch(url);

        if(!response.ok){
            // Lanzar un error si el estado HTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Espera a que el JSON se parseé

        return data;
    } catch (error) {
        console.error("Error al buscar la informacion:", error);
        // Retornar un array vacio o null aqui si hay un error
        return [];
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

function LlenartablaGestor(array, event){
    // creamos las constantes con la informacion
    const products = array;
    const movimientos = event
    // llamos a la funcion para colocar los datos en la tabla
    funciones.LlenarTabla(products, movimientos);
}