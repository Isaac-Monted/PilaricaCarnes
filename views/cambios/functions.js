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

const ListaOrigen = {
    id_producto: cambiosElements.id_producto_Origen,
    cajas: cambiosElements.cajas_Origen,
    kilosBru: cambiosElements.kilosBru_Origen,
    piezasExt: cambiosElements.piezasExt_Origen,
    destareAdd: cambiosElements.destareAdd_Origen,
    totalPz: cambiosElements.totalPz_Origen,
    totalKg: cambiosElements.totalKg_Origen
}

const ListaDestino = {
    id_producto: cambiosElements.id_producto_Destino,
    cajas: cambiosElements.cajas_Destino,
    kilosBru: cambiosElements.kilosBru_Destino,
    piezasExt: cambiosElements.piezasExt_Destino,
    destareAdd: cambiosElements.destareAdd_Destino,
    totalPz: cambiosElements.totalPz_Destino,
    totalKg: cambiosElements.totalKg_Destino
}

// declarar las listas que se van a llenar
const Listas = {
    ListaOrigen: document.getElementById("listaResultadosOrigenCambios"),
    ListaDestino: document.getElementById("listaResultadosDestinoCambios")
};

// ========================== EVENTOS ==========================
export async function AgregarCambio(){

}

export function LimpiarCambios(){
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

}

export async function EliminarCambio(){

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
    
    console.log(Casillas, id_producto, nombre_producto);
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
    
}

export async function LlenarCasillaConDatos(){
    
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
    await fetch(`/../carnes/api/Productos.php?action=LeerProductos`)
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
    /* await fetch(`/../carnes/api/cambios.php?action=LeerCambios`)
        .then(respuesta => respuesta.json()) // Esperar la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.LlenarTabla(data);
        })
        .catch(error => {
            console.error("Error al buscar cambios:", error);
    }); */
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