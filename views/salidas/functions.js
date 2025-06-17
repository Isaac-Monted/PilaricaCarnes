import * as globales from '../../js/global.js';
import * as funciones from '../../models/salidas.js';
// ========================== DOM ==========================
window.addEventListener("DOMContentLoaded", function(){
    console.log("salidas");
    Cargarpagina();
});

// mapa con los campos del formulario
const salidasElements = {
    filtroFecha: document.getElementById("fechaF_salidas"),
    filtroProductos: document.getElementById("productoF_salidas"),
    id: document.getElementById("id_salidas"),
    producto: document.getElementById("nombre_salidas"),
    id_producto: document.getElementById("id_producto_salidas"),
    cajas: document.getElementById("cajas_salidas"),
    kilosBru: document.getElementById("kilosB_salidas"),
    piezasExt: document.getElementById("piezasE_salidas"),
    destareAdd: document.getElementById("destareA_salidas"),
    totalPz: document.getElementById("totalP_salidas"),
    totalKg: document.getElementById("totalK_salidas"),
    observaciones: document.getElementById("Observaciones_salidas")
};

// declarar la lista que se va a llenar
const Lista = document.getElementById("listaResultadosSalidas");

// ========================== EVENTOS ==========================
export async function AgregarSalida(){
    if(!salidasElements.filtroFecha.value){
        alert("por favor seleccione una fecha");
        return;
    }else if(!salidasElements.producto.value){
        alert("por favor seleccione un producto");
        return;
    } else{
        console.log("Agregar");
        // promesa para enviar los datos al servidor y esperar la confirmacion
        const responseData = await fetch(`/../carnes/api/salidas.php?action=AgregarSalida`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                fecha: salidasElements.filtroFecha.value,
                producto: salidasElements.id_producto.value,
                cajas: salidasElements.cajas.value,
                kilosBrutos: salidasElements.kilosBru.value,
                piezasExtra: salidasElements.piezasExt.value,
                destareAdd: salidasElements.destareAdd.value,
                observaciones: salidasElements.observaciones.value
            })
        });
        // Verifiacar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostra el mnensaje acorde a la respuesta del servidor
        if(respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha agregado correctamente");
            LimpiarSalidas();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se agrego la salida");
        }
    }
}

export function LimpiarSalidas(){
    console.log("Limpiar");

    // limpiar cada una de las casillas
    Object.keys(salidasElements).forEach(key => {
        const casilla = salidasElements[key];
        casilla.value = "";
    });

    Lista.innerHTML = ''; // Limpiar el contenido de la lista

    //Calcular los campos calculados
    CalcularCamposCalculados();
    // Actualizar la tabla
    LlenartablaSalidas();
}

export async function EditarSalida(){
    if(!salidasElements.filtroFecha.value){
        alert("por favor seleccione una fecha");
        return;
    }else if(!salidasElements.producto.value || !salidasElements.id.value){
        alert("por favor seleccione un registro");
        return;
    } else {
        console.log("Editar");
        // Promesa para enviar los datos al servidor y esperar ñas confirmacion
        const responseData = await fetch(`/../carnes/api/salidas.php?action=EditarSalida`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: salidasElements.id.value,
                fecha: salidasElements.filtroFecha.value,
                producto: salidasElements.id_producto.value,
                cajas: salidasElements.cajas.value,
                kilosBrutos: salidasElements.kilosBru.value,
                piezasExtra: salidasElements.piezasExt.value,
                destareAdd: salidasElements.destareAdd.value,
                observaciones: salidasElements.observaciones.value
            })
        });
        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostar el mensaje acorde a la respuesta del servidor
        if(respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha editado correctamente");
            LimpiarSalidas();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se a editado la salida");
        }
    }
}

export async function EliminarSalida(){
    // declarar la casilla con el id a eliminar
    const idCasilla = salidasElements.id;
    if(!idCasilla.value){
        alert("por favor seleccione un producto");
        return;
    }
    let confirmar = confirm("Esta seguro de eliminar la salida");

    if(confirmar){
        console.log("Eliminar");
        // promesa para enviar los datos al servidor y esperar la coonfirmacion
        const responseData = await fetch('/../carnes/api/salidas.php?action=EliminarSalida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: idCasilla.value
            })
        });

        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostrar el mensaje acorde a la respuesta del servidor
        if (respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha eliminado correctamentre");
            LimpiarSalidas();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se eliminado la salida")
        }
    }
}

export async function SeleccionarProducto(Texto){
    const productosFiltrados = await globales.BuscarProductoText(Texto);
    funciones.LlenarListaConDatos(productosFiltrados);
}

export function ColocarSeleccionEnCasillas(id_producto, nombre_producto){
    console.log(id_producto, nombre_producto);
    // colocar los datos en las casillas
    salidasElements.id_producto.value = id_producto;
    salidasElements.producto.value = nombre_producto;
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
    console.log("Filtrado");
    // construir el objeto con filtros
    const filters = {};

    // Determinar que filtros estan activos para armar la consulta
    if(salidasElements.filtroFecha.value){
        console.log("Fecha");
        filters["fecha_registro"] = salidasElements.filtroFecha.value;
    }
    if(salidasElements.filtroProductos.value){
        console.log("Producto");
        filters["producto_id"] = salidasElements.filtroProductos.value;
    }
    if(!salidasElements.filtroFecha.value && !salidasElements.filtroProductos.value){
        console.log("Ninguno");
        LlenartablaSalidas();
        return;
    }

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerSalidas'); // siempre añadir la accion

    // Codificar el objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Enviar todo el objeto filters como una cadena JSON

    // Construir la URL Completa usando template literals y params.toString()
    const url = `/../carnes/api/salidas.php?${params.toString()}`;

    // Realizar la solicitud Ajax
    try{
        const response = await fetch(url);

        if (!response.ok) {
            // Lanzar un error si el estado HTTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Esperar a que el JSON se parseé

        console.log(data);
        funciones.LlenarTabla(data);

    } catch (error) {
        console.error("Error al buscar salidas:", error);
        // Podras retornar un array vacio o null aqui si hay un error
        return [];
    }
}

export async function LlenarCasillaConDatos(id_salidas){
    // construir el objeto de filtros
    const filters = {
        id: id_salidas,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerSalidas'); // Siempre añadir la accion

    // Codificar eñ objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Enviar todo el objeto filters como una cadena JSON

    // Construir la URL completa usando template literals y params.toString()
    const url = `/../carnes/api/salidas.php?${params.toString()}`;

    // Realizar la solicitud Ajax
    try{
        const response = await fetch(url);

        if (!response.ok) {
            // Lanzar un error si el estado HTTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Esperar a que el JSON se parseé

        //console.log(data);
        funciones.ColocarDatosFormulario(data, salidasElements);

    } catch (error) {
        console.error("Error al buscar productos:", error);
        // Podras retornar un array vacío o null aquí si hay un error
        return [];
    }
}

function Cargarpagina(){
    LlenarFiltroProductos();
    LlenartablaSalidas();
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

async function LlenartablaSalidas(){
    // Traer todos las salidas de la base de datos
    await fetch(`/../carnes/api/salidas.php?action=LeerSalidas`)
        .then(respuesta => respuesta.json()) // Esperar la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.LlenarTabla(data);
        })
        .catch(error => {
            console.error("Error al buscar salidas:", error);
    });
}

export async function CalcularCamposCalculados(){
    console.log("calculando");
    if(!salidasElements.cajas.value && !salidasElements.kilosBru.value && !salidasElements.piezasExt.value && !salidasElements.destareAdd.value){
        // Colocar las casillas en cero
        salidasElements.totalPz.value = 0.00;
        salidasElements.totalKg.value = 0.00;
    } else {
        // Declarar las casillas que se utilizan
        let cajas = parseFloat(salidasElements.cajas.value) || 0;
        let kilosBrutos = parseFloat(salidasElements.kilosBru.value) || 0;
        let piezasExtra = parseFloat(salidasElements.piezasExt.value) || 0;
        let destareAdicional = parseFloat(salidasElements.destareAdd.value) || 0;
        // Buscar cuantas piezas tiene cada caja de producto
        const DataProd = await globales.BuscarProductoId(salidasElements.id_producto.value);
        let piezasCaja = 0;
        if(DataProd && !DataProd.error){
            console.log(DataProd);
            piezasCaja = DataProd[0].piezas_x_caja;
        }

        //console.log(piezasCaja);
        // Calcular los totales
        const TotalPiezas = (cajas * piezasCaja) + piezasExtra;
        const TotalKilos = kilosBrutos - (cajas * 2.4) - destareAdicional;
        // Colocar los resultados
        salidasElements.totalPz.value = TotalPiezas;
        salidasElements.totalKg.value = TotalKilos.toFixed(2);
    }
}