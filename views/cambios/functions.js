import * as globales from '../../js/global.js';
import * as funciones from '../../models/cambios.js';
// ========================== DOM ==========================
window.addEventListener("DOMContentLoaded", function(){
    console.log("cambios");
    Cargarpagina();
});

// mapa con los campos del formulario
const cambiosElements = {
    filtroFecha: document.getElementById("fechaF_cambios"),
    filtroProducto_Origen: document.getElementById("producto_OF_cambios"),
    filtroProducto_Destino: document.getElementById("producto_DF_cambios"),
    id: document.getElementById("id_cambios"),
    producto_Origen: document.getElementById("nombre_origen_cambios"),
    id_producto_Origen: document.getElementById("id_producto_origen_cambios"),
    producto_Destino: document.getElementById("nombre_destino_cambios"),
    id_producto_Destino: document.getElementById("id_producto_destino_cambios"),
    cajas_Origen: document.getElementById("cajasOri_cambios"),
    kilosBru_Origen: document.getElementById("kilosBOri_cambios"),
    piezasExt_Origen: document.getElementById("piezasEOri_cambios"),
    destareAdd_Origen: document.getElementById("destareAOri_cambios"),
    totalPz_Origen: document.getElementById("totalPOri_cambios"),
    totalKg_Origen: document.getElementById("totalKOri_cambios"),
    cajas_Destino: document.getElementById("cajasDes_cambios"),
    kilosBru_Destino: document.getElementById("kilosBDes_cambios"),
    piezasExt_Destino: document.getElementById("piezasEDes_cambios"),
    destareAdd_Destino: document.getElementById("destareADes_cambios"),
    totalPz_Destino: document.getElementById("totalPDes_cambios"),
    totalKg_Destino: document.getElementById("totalKDes_cambios"),
    observaciones: document.getElementById("Observaciones_cambios")
};

const cambiosFormulario = {
    id: document.getElementById("id_cambios"),
    producto_Origen: document.getElementById("nombre_origen_cambios"),
    id_producto_Origen: document.getElementById("id_producto_origen_cambios"),
    producto_Destino: document.getElementById("nombre_destino_cambios"),
    id_producto_Destino: document.getElementById("id_producto_destino_cambios"),
    cajas_Origen: document.getElementById("cajasOri_cambios"),
    kilosBru_Origen: document.getElementById("kilosBOri_cambios"),
    piezasExt_Origen: document.getElementById("piezasEOri_cambios"),
    destareAdd_Origen: document.getElementById("destareAOri_cambios"),
    totalPz_Origen: document.getElementById("totalPOri_cambios"),
    totalKg_Origen: document.getElementById("totalKOri_cambios"),
    cajas_Destino: document.getElementById("cajasDes_cambios"),
    kilosBru_Destino: document.getElementById("kilosBDes_cambios"),
    piezasExt_Destino: document.getElementById("piezasEDes_cambios"),
    destareAdd_Destino: document.getElementById("destareADes_cambios"),
    totalPz_Destino: document.getElementById("totalPDes_cambios"),
    totalKg_Destino: document.getElementById("totalKDes_cambios"),
    observaciones: document.getElementById("Observaciones_cambios")
}

// declarar las listas que se van a llenar
const Listas = {
    ListaOrigen: document.getElementById("listaResultadosOrigenCambios"),
    ListaDestino: document.getElementById("listaResultadosDestinoCambios")
};

// Creamos listas especificas para cada uno de los grupos de widgwts
const ListaOrigen = {
    id_producto: cambiosElements.id_producto_Origen,
    producto: cambiosElements.producto_Origen,
    cajas: cambiosElements.cajas_Origen,
    kilosBru: cambiosElements.kilosBru_Origen,
    piezasExt: cambiosElements.piezasExt_Origen,
    destareAdd: cambiosElements.destareAdd_Origen,
    totalPz: cambiosElements.totalPz_Origen,
    totalKg: cambiosElements.totalKg_Origen,
    lista: Listas.ListaOrigen,
    tipo: "origen"
}

const ListaDestino = {
    id_producto: cambiosElements.id_producto_Destino,
    producto: cambiosElements.producto_Destino,
    cajas: cambiosElements.cajas_Destino,
    kilosBru: cambiosElements.kilosBru_Destino,
    piezasExt: cambiosElements.piezasExt_Destino,
    destareAdd: cambiosElements.destareAdd_Destino,
    totalPz: cambiosElements.totalPz_Destino,
    totalKg: cambiosElements.totalKg_Destino,
    lista: Listas.ListaDestino,
    tipo: "destino"
}

// ========================== EVENTOS ==========================
export async function AgregarCambio(){
    if(!cambiosElements.filtroFecha.value){
        alert("por favor seleccione una fecha");
        return;
    }else if(!cambiosElements.producto_Origen.value){
        alert("por favor seleccione un producto inicial");
        return;
    }else if(!cambiosElements.producto_Destino.value){
        alert("por favor seleccione un producto final");
        return;
    }else{
        console.log("Agregar");
        // promesa para enviar los datos al servidor y esperar la confirmacion
        const responseData = await fetch(`/../carnes/api/cambios.php?action=AgregarCambio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                fecha: cambiosElements.filtroFecha.value,
                producto_origen: cambiosElements.id_producto_Origen.value,
                producto_destino: cambiosElements.id_producto_Destino.value,
                cajas_origen: cambiosElements.cajas_Origen.value,
                kilosBrutos_origen: cambiosElements.kilosBru_Origen.value,
                piezasExtra_origen: cambiosElements.piezasExt_Origen.value,
                destareAdd_origen: cambiosElements.destareAdd_Origen.value,
                cajas_destino: cambiosElements.cajas_Destino.value,
                kilosBrutos_destino: cambiosElements.kilosBru_Destino.value,
                piezasExtra_destino: cambiosElements.piezasExt_Destino.value,
                destareAdd_destino: cambiosElements.destareAdd_Destino.value,
                observaciones: cambiosElements.observaciones.value
            })
        });
        // Verifiacar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostra el mnensaje acorde a la respuesta del servidor
        if(respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha agregado correctamente");
            LimpiarCambios();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se agrego la salida");
        }
    }
}

export function LimpiarCambios(){
    console.log("Limpiar");
    
    // limpiar cada una de las casillas
    Object.keys(cambiosFormulario).forEach(key => {
        const casilla = cambiosFormulario[key];
        casilla.value = "";
    });

    Listas.ListaOrigen.innerHTML = ''; // Limpiar el contenido de la lista
    Listas.ListaDestino.innerHTML = ''; // Limpiar el contenido de la lista

    //Calcular los campos calculados
    CalcularCamposCalculados("origen");
    CalcularCamposCalculados("destino");
    // Actualizar la tabla
    AplicarFiltros();
}

export function LimpiarAllCambios(){
    console.log("Limpiar");
    
    // limpiar cada una de las casillas
    Object.keys(cambiosElements).forEach(key => {
        const casilla = cambiosElements[key];
        casilla.value = "";
    });

    Listas.ListaOrigen.innerHTML = ''; // Limpiar el contenido de la lista
    Listas.ListaDestino.innerHTML = ''; // Limpiar el contenido de la lista

    //Calcular los campos calculados
    CalcularCamposCalculados("origen");
    CalcularCamposCalculados("destino");
    // Actualizar la tabla
    LlenartablaCambios();
}

export async function EditarCambio(){
    if(!cambiosElements.filtroFecha.value){
        alert("por favor seleccione una fecha");
        return;
    }else if(!cambiosElements.producto_Origen.value || !cambiosElements.id.value){
        alert("por favor seleccione un producto inicial");
        return;
    }else if(!cambiosElements.producto_Destino.value || !cambiosElements.id.value){
        alert("por favor seleccione un producto final");
        return;
    }else{
        console.log("Editar");
        // Promesa para enviar los datos al servidor y esperar ñas confirmacion
        const responseData = await fetch(`/../carnes/api/cambios.php?action=EditarCambio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: cambiosElements.id.value,
                fecha: cambiosElements.filtroFecha.value,
                producto_origen: cambiosElements.id_producto_Origen.value,
                producto_destino: cambiosElements.id_producto_Destino.value,
                cajas_origen: cambiosElements.cajas_Origen.value,
                kilosBrutos_origen: cambiosElements.kilosBru_Origen.value,
                piezasExtra_origen: cambiosElements.piezasExt_Origen.value,
                destareAdd_origen: cambiosElements.destareAdd_Origen.value,
                cajas_destino: cambiosElements.cajas_Destino.value,
                kilosBrutos_destino: cambiosElements.kilosBru_Destino.value,
                piezasExtra_destino: cambiosElements.piezasExt_Destino.value,
                destareAdd_destino: cambiosElements.destareAdd_Destino.value,
                observaciones: cambiosElements.observaciones.value
            })
        });
        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostar el mensaje acorde a la respuesta del servidor
        if(respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha editado correctamente");
            LimpiarCambios();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se a editado la salida");
        }
    }
}

export async function EliminarCambio(){
    // declarar la casilla con el id a eliminar
    const idCasilla = cambiosElements.id;
    if(!idCasilla.value){
        alert("por favor seleccione un registro");
        return;
    }
    let confirmar = confirm("Esta seguro de eliminar el cambio");

    if(confirmar){
        console.log("Eliminar");
        // promesa para enviar los datos al servidor y esperar la coonfirmacion
        const responseData = await fetch('/../carnes/api/cambios.php?action=EliminarCambio', {
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
            LimpiarCambios();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se eliminado la cambio")
        }
    }
}

export async function EstadoCambio(){
    if(!cambiosElements.id.value){
        alert("por favor seleccione un registro");
        return;
    } else {
        let confirmar = confirm("Esta seguro de eliminar el cambio");

        if(confirmar){
            console.log("Estado");
            // Promesa para enviar los datos al servidor y esperar ñas confirmacion
            const responseData = await fetch(`/../carnes/api/cambios.php?action=EstadoCambio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    id: cambiosElements.id.value,
                    estado: 'Inactivo'
                })
            });
            // Verificar si la respuesta fue exitosa
            const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

            // mostar el mensaje acorde a la respuesta del servidor
            if(respuesta.success){
                console.log('Respuesta:', respuesta.message);
                alert("Se ha eliminado correctamente");
                LimpiarCambios();
            }else{
                console.error('Error:', respuesta.message);
                alert("Opps! No se a eliminado el cambio");
            }
        }
    }
}

export async function SeleccionarProducto(Casilla, Texto){ // Dual
    let listaLocal;
    // crear sub lista con las casillas necesarias para la operacion
    listaLocal ={};
    if(Casilla === "origen"){
        listaLocal = ListaOrigen;
    }else if(Casilla === "destino"){
        listaLocal = ListaDestino;
    }else{
        throw new Error("La lista no contiene las casillas requeridas")
    }
    const productosFiltrados = await globales.BuscarProductoText(Texto);
    funciones.LlenarListaConDatos(listaLocal, productosFiltrados);
}

export function ColocarSeleccionEnCasillas(Casillas ,id_producto, nombre_producto){ // Dual
    let listaLocal = {}
    let casillasLocal = {}
    // crear sub lista con las casillas necesarias para la operacion
    if(Casillas === "origen"){
        casillasLocal = ListaOrigen;
        listaLocal = Listas.ListaOrigen;
    }else if(Casillas === "destino"){
        casillasLocal = ListaDestino;
        listaLocal = Listas.ListaDestino;
    }else{
        throw new Error("La lista no contiene las casillas requeridas")
    }
    
    //console.log(Casillas, id_producto, nombre_producto);
    // colocar los datos en las casillas
    casillasLocal.id_producto.value = id_producto;
    casillasLocal.producto.value = nombre_producto;
    listaLocal.innerHTML = ''; // Limpiar el contenido de la lista
}

export function focoCasilla(Casilla, evento){ // Dual
    let listaLocal;
    // crear sub lista con las casillas necesarias para la operacion
    listaLocal ={};
    if(Casilla === "origen"){
        listaLocal = Listas.ListaOrigen;
    }else if(Casilla === "destino"){
        listaLocal = Listas.ListaDestino;
    }else{
        throw new Error("Lqa lista no contiene las casillas requeridas")
    }

    if(evento===true){
        listaLocal.style.display = 'block'; // Asegurarse de que la lista esté oculta
    }else if(evento === false){
        listaLocal.style.display = 'none'; // Asegurarse de que la lista esté oculta
    }else{
        listaLocal.innerHTML = ''; // Limpiar el contenido de la lista
    }
}

export async function AplicarFiltros(){
    console.log("Filtrado");
    // construir el objeto con filtros
    const filters = {};

    // Determinar que filtros estan activos para armar la consulta
    if(cambiosElements.filtroFecha.value){
        console.log("Fecha");
        filters["fecha_registro"] = cambiosElements.filtroFecha.value;
    }
    if(cambiosElements.filtroProducto_Origen.value){
        console.log("Producto Origen");
        filters["producto_origen_id"] = cambiosElements.filtroProducto_Origen.value;
    }
    if(cambiosElements.filtroProducto_Destino.value){
        console.log("Producto Destino");
        filters["producto_destino_id"] = cambiosElements.filtroProducto_Destino.value;
    }
    if(!cambiosElements.filtroFecha.value && !cambiosElements.filtroProducto_Origen.value && !cambiosElements.filtroProducto_Destino.value){
        console.log("Ninguno");
        LlenartablaCambios();
        return;
    }

    // Colocar el filtro para mostrar solo registros activos
    filters["estado"] = 'Activo';

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerCambios'); // siempre añadir la accion

    // Codificar el objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Enviar todo el objeto filters como una cadena JSON

    // Construir la URL Completa usando template literals y params.toString()
    const url = `/../carnes/api/cambios.php?${params.toString()}`;

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
        console.error("Error al buscar cambios:", error);
        // Podras retornar un array vacio o null aqui si hay un error
        return [];
    }
}

export async function LlenarCasillaConDatos(id_cambio){
    // construir el objeto de filtros
    const filters = {
        id: id_cambio,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerCambios'); // Siempre añadir la accion

    // Codificar eñ objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Enviar todo el objeto filters como una cadena JSON

    // Construir la URL completa usando template literals y params.toString()
    const url = `/../carnes/api/cambios.php?${params.toString()}`;

    // Realizar la solicitud Ajax
    try{
        const response = await fetch(url);

        if (!response.ok) {
            // Lanzar un error si el estado HTTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Esperar a que el JSON se parseé

        //console.log(data);
        funciones.ColocarDatosFormulario(data, cambiosElements);

    } catch (error) {
        console.error("Error al buscar productos:", error);
        // Podras retornar un array vacío o null aquí si hay un error
        return [];
    }
}

function Cargarpagina(){
    LlenarFiltroProductos(cambiosElements.filtroProducto_Origen);
    LlenarFiltroProductos(cambiosElements.filtroProducto_Destino);
    LlenartablaCambios();
    CalcularCamposCalculados("origen");
    CalcularCamposCalculados("destino");
}

// ========================== FUNCIONES ==========================
async function LlenarFiltroProductos(casilla){
    // Traer todos los productos de la base de datos
    await fetch(`/../carnes/api/Productos.php?action=LeerProductos&filters=%7B%22estado%22%3A%22Activo%22%7D`)
        .then(respuesta => respuesta.json()) // Espera la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.ColocarProductosEnLista(casilla, data);
        })
        .catch(error => {
            console.error("Error al buscar productos:", error);
    });
}

async function LlenartablaCambios(){
    // Traer todos las cambios de la base de datos
    await fetch(`/../carnes/api/cambios.php?action=LeerCambios&filters=%7B%22estado%22%3A%22Activo%22%7D`)
        .then(respuesta => respuesta.json()) // Esperar la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.LlenarTabla(data);
        })
        .catch(error => {
            console.error("Error al buscar cambios:", error);
    });
}

export async function CalcularCamposCalculados(Casillas){ // Dual
    let listaLocal = {}
    // crear sub lista con las casillas necesarias para la operacion
    if(Casillas === "origen"){
        listaLocal = ListaOrigen;
    }else if(Casillas === "destino"){
        listaLocal = ListaDestino;
    }else{
        throw new Error("La lista no contiene las casillas requeridas")
    }
    
    console.log("calculando");
    if(!listaLocal.cajas.value && !listaLocal.kilosBru.value && !listaLocal.piezasExt.value && !listaLocal.destareAdd.value){
        // Colocar las casillas en cero
        listaLocal.totalPz.value = 0.00;
        listaLocal.totalKg.value = 0.00;
    } else {
        // Declarar las casillas que se utilizan
        let cajas = parseFloat(listaLocal.cajas.value) || 0;
        let kilosBrutos = parseFloat(listaLocal.kilosBru.value) || 0;
        let piezasExtra = parseFloat(listaLocal.piezasExt.value) || 0;
        let destareAdicional = parseFloat(listaLocal.destareAdd.value) || 0;
        // Buscar cuantas piezas tiene cada caja de producto
        const DataProd = await globales.BuscarProductoId(listaLocal.id_producto.value);
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
        listaLocal.totalPz.value = TotalPiezas;
        listaLocal.totalKg.value = TotalKilos.toFixed(2);
    }
}