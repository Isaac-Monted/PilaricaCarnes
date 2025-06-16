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
    id_producto: document.getElementById("id_producto_entradas"),
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
export async function AgregarEntrada(){
    if(!entradasElements.filtroFecha.value){
        alert("por favor seleccione una fecha");
        return;
    }else if(!entradasElements.producto.value){
        alert("por favor seleccione un producto");
        return;
    } else{
        console.log("Agregar");
        // promesa para enviar los datos al servidor y esperar la confirmacion
        const responseData = await fetch(`/../carnes/api/entradas.php?action=AgregarEntrada`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                fecha: entradasElements.filtroFecha.value,
                producto: entradasElements.id_producto.value,
                cajas: entradasElements.cajas.value,
                kilosBrutos: entradasElements.kilosBru.value,
                piezasExtra: entradasElements.piezasExt.value,
                destareAdd: entradasElements.destareAdd.value,
                observaciones: entradasElements.observaciones.value
            })
        });
        // Verifiacar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostra el mnensaje acorde a la respuesta del servidor
        if(respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha agregado correctamente");
            LimpiarEntradas();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se agrego la entrada");
        }
    }
}

export function LimpiarEntradas(){
    console.log("Limpiar");

    // limpiar cada una de las casillas
    Object.keys(entradasElements).forEach(key => {
        const casilla = entradasElements[key];
        casilla.value = "";
    });

    Lista.innerHTML = ''; // Limpiar el contenido de la lista

    //Calcular los campos calculados
    CalcularCamposCalculados();
    // Actualizar la tabla
    LlenartablaEntradas();
}

export async function EditarEntrada(){
    if(!entradasElements.filtroFecha.value){
        alert("por favor seleccione una fecha");
        return;
    }else if(!entradasElements.producto.value || !entradasElements.id.value){
        alert("por favor seleccione un registro");
        return;
    } else {
        console.log("Editar");
        // Promesa para enviar los datos al servidor y esperar ñas confirmacion
        const responseData = await fetch(`/../carnes/api/entradas.php?action=EditarEntrada`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                id: entradasElements.id.value,
                fecha: entradasElements.filtroFecha.value,
                producto: entradasElements.id_producto.value,
                cajas: entradasElements.cajas.value,
                kilosBrutos: entradasElements.kilosBru.value,
                piezasExtra: entradasElements.piezasExt.value,
                destareAdd: entradasElements.destareAdd.value,
                observaciones: entradasElements.observaciones.value
            })
        });
        // Verificar si la respuesta fue exitosa
        const respuesta = await responseData.json(); // Aseguramos que el PHP devuelve un JSON

        // mostar el mensaje acorde a la respuesta del servidor
        if(respuesta.success){
            console.log('Respuesta:', respuesta.message);
            alert("Se ha editado correctamente");
            LimpiarEntradas();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se a editado la entrada");
        }
    }
}

export async function EliminarEntrada(){
    // declarar la casilla con el id a eliminar
    const idCasilla = entradasElements.id;
    if(!idCasilla.value){
        alert("por favor seleccione un producto");
        return;
    }
    let confirmar = confirm("Esta seguro de eliminar la entrada");

    if(confirmar){
        console.log("Eliminar");
        // promesa para enviar los datos al servidor y esperar la coonfirmacion
        const responseData = await fetch('/../carnes/api/entradas.php?action=EliminarEntradas', {
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
            LimpiarEntradas();
        }else{
            console.error('Error:', respuesta.message);
            alert("Opps! No se eliminado la entrada")
        }
    }
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

export async function AplicarFiltros(){
    console.log("Filtrado");
    // construir el objeto con filtros
    const filters = {};

    // Determinar que filtros estan activos para armar la consulta
    if(entradasElements.filtroFecha.value){
        console.log("Fecha");
        filters["fecha_registro"] = entradasElements.filtroFecha.value;
    }
    if(entradasElements.filtroProductos.value){
        console.log("Producto");
        filters["producto_id"] = entradasElements.filtroProductos.value;
    }
    if(!entradasElements.filtroFecha.value && !entradasElements.filtroProductos.value){
        console.log("Ninguno");
        LlenartablaEntradas();
        return;
    }

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerEntradas'); // siempre añadir la accion

    // Codificar el objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Enviar todo el objeto filters como una cadena JSON

    // Construir la URL Completa usando template literals y params.toString()
    const url = `/../carnes/api/entradas.php?${params.toString()}`;

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
        console.error("Error al buscar entradas:", error);
        // Podras retornar un array vacio o null aqui si hay un error
        return [];
    }
}

export async function LlenarCasillaConDatos(id_entradas){
    // construir el objeto de filtros
    const filters = {
        id: id_entradas,
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerEntradas'); // Siempre añadir la accion

    // Codificar eñ objeto filters a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Enviar todo el objeto filters como una cadena JSON

    // Construir la URL completa usando template literals y params.toString()
    const url = `/../carnes/api/entradas.php?${params.toString()}`;

    // Realizar la solicitud Ajax
    try{
        const response = await fetch(url);

        if (!response.ok) {
            // Lanzar un error si el estado HTTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Esperar a que el JSON se parseé

        //console.log(data);
        funciones.ColocarDatosFormulario(data, entradasElements);

    } catch (error) {
        console.error("Error al buscar productos:", error);
        // Podras retornar un array vacío o null aquí si hay un error
        return [];
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

async function LlenartablaEntradas(){
    // Traer todos las entradas de la base de datos
    await fetch(`/../carnes/api/entradas.php?action=LeerEntradas`)
        .then(respuesta => respuesta.json()) // Esperar la respuesta como JSON
        .then(data => {
            console.log(data);
            funciones.LlenarTabla(data);
        })
        .catch(error => {
            console.error("Error al buscar entradas:", error);
    });
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
        const DataProd = await BuscarProductoId(entradasElements.id_producto.value);
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
        entradasElements.totalPz.value = TotalPiezas;
        entradasElements.totalKg.value = TotalKilos.toFixed(2);

    }
}

export async function BuscarProductoId(id_prod){
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
