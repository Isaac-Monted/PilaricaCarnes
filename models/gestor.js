import { ColocarSeleccionEnCasillas } from '../views/gestor/functions.js';

export function LlenarTabla(products, movimiento){
    // Elementos de la tabla
    const Encabezados = document.getElementById("EncabezadoTablagestor");
    const Tabla = document.getElementById("contenedorTablagestor");
    // Llenar la tabla dependiendo de los requerimientos del usuario
    switch(movimiento){
        case "Entradas":
            LlenarTablaE(products, Encabezados, Tabla); // Tabla Entradas
            return;
        case "Salidas":
            LlenarTablaS(products, Encabezados, Tabla); // Tabla Salidas
            return;
        case "Cambios":
            LlenarTablaC(products, Encabezados, Tabla); // Tabla Cambios de presentacion
            return;
        case "Inventario":
            LlenarTablaI(products, Encabezados, Tabla); // Tabla Inventarios
            return;
        default:
            // limpiar el contenido
            Tabla.innerHTML = '';
            Encabezados.innerHTML = '';

            const voidRow = document.createElement("tr"); // Crear la fila en blanco en caso de error
            const headerVoid = document.createElement("tr"); // Crear el encabezado en blanco en caso de error
            voidRow.innerHTML=`
                <td style="display: none"></td>
                <td> </td>
                <td style="display: none"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            `;
            headerVoid.innerHTML = `
                <th style="display: none"></th>
                <th></th>
                <th style="display: none"></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            `;
            Tabla.appendChild(voidRow); // Mostrar el mensaje de error en el DOM
            Encabezados.appendChild(headerVoid); // Colocar el encabezado en la tabla
            return;
    }
}

function LlenarTablaE(products, encabezados, tabla){
    const Encabezados = encabezados
    const Tabla = tabla

    // limpiar el contenido
    Tabla.innerHTML = '';
    Encabezados.innerHTML = '';

    // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (products.error){
        const errorRow = document.createElement("tr"); // Crear la fila en blanco en caso de error
        const headerError = document.createElement("tr"); // Crear el encabezado en blanco en caso de error
        errorRow.innerHTML=`
            <td style="display: none"></td>
            <td> </td>
            <td style="display: none"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        headerError.innerHTML = `
            <th style="display: none"></th>
            <th></th>
            <th style="display: none"></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        `;
        Tabla.appendChild(errorRow); // Mostrar el mensaje de error en el DOM
        Encabezados.appendChild(headerError); // Colocar el encabezado en la tabla
        return;
    }

    // si no hay productos, mostrar un mensaje adecuado
    if (products.length === 0){
        const noProductRow = document.createElement("tr"); // Crear la fila en blanco en caso de no haber productos
        const headerNoProduct = document.createElement("tr"); // Crear el encabezado en blanco en caso de no haber productos
        noProductRow.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        headerNoProduct.innerHTML = `
            <td style="display: none"></td>
            <td> </td>
            <td style="display: none"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        Tabla.appendChild(noProductRow); // Colocar las filas en la tabla
        Encabezados.appendChild(headerNoProduct); // Colocar el encabezado en la tabla
        return;
    }

    const headerRegistro = document.createElement("tr"); // crear el encabezado de la tabla con las columnas necesarias
    headerRegistro.innerHTML = `
        <th style="display: none">id</th>
        <th>Fecha</th>
        <th>Producto</th>
        <th style="display: none">id_producto</th>
        <th>Cajas</th>
        <th>Kilos Brutos</th>
        <th>Piezas extras</th>
        <th>Destare Adicional</th>
        <th>Total Piezas</th>
        <th>Total Kilos</th>
    `;
    Encabezados.appendChild(headerRegistro); // Colocar el encabezado con las columnas necesarias en la tabla

    // Recorrer los registros y crear elementos para mostrarlos
    products.forEach(product => {
        const registroTable = document.createElement("tr"); // crear una fila para cada fila retornada

        // Convertir la fecha en un formato valido
        let fechaCompleta = product.fecha_registro;
        let soloFecha = fechaCompleta.split(' ')[0];

        // Agregar el contenido a la tabla de visualizacion
        registroTable.innerHTML = `
            <td style="display: none">${product.id}</td>
            <td>${soloFecha}</td>
            <td>${product.nombre_producto}</td>
            <td style="display: none">${product.producto_id}</td>
            <td>${product.cajas}</td>
            <td>${product.kilos_brutos}</td>
            <td>${product.piezas_extra}</td>
            <td>${product.destare_add}</td>
            <td>${product.total_piezas}</td>
            <td>${product.total_kilos}</td>
        `;
        Tabla.appendChild(registroTable); // colocar la fila con la informacion en la tabla
        
    });
}

function LlenarTablaS(products, encabezados, tabla){
    const Encabezados = encabezados
    const Tabla = tabla

    // limpiar el contenido
    Tabla.innerHTML = '';
    Encabezados.innerHTML = '';

    // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (products.error){
        const errorRow = document.createElement("tr"); // Crear la fila en blanco en caso de error
        const headerError = document.createElement("tr"); // Crear el encabezado en blanco en caso de error
        errorRow.innerHTML=`
            <td style="display: none"> </td>
            <td> </td>
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        headerError.innerHTML = `
            <th style="display: none"></th>
            <th></th>
            <th style="display: none"></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        `;
        Tabla.appendChild(errorRow); // Mostrar el mensaje de error en el DOM
        Encabezados.appendChild(headerError); // Colocar el encabezado en la tabla
        return;
    }

    // si no hay productos, mostrar un mensaje adecuado
    if (products.length === 0){
        const noProductRow = document.createElement("tr"); // Crear la fila en blanco en caso de no haber productos
        const headerNoProduct = document.createElement("tr"); // Crear el encabezado en blanco en caso de no haber productos
        noProductRow.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        headerNoProduct.innerHTML = `
            <td style="display: none"></td>
            <td> </td>
            <td style="display: none"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        Tabla.appendChild(noProductRow); // Colocar las filas en la tabla
        Encabezados.appendChild(headerNoProduct); // Colocar el encabezado en la tabla
        return;
    }

    const headerRegistro = document.createElement("tr"); // crear el encabezado de la tabla con las columnas necesarias
    headerRegistro.innerHTML = `
        <th style="display: none">id</th>
        <th>Fecha</th>
        <th>Producto</th>
        <th style="display: none">id_producto</th>
        <th>Cajas</th>
        <th>Kilos Brutos</th>
        <th>Piezas extras</th>
        <th>Destare Adicional</th>
        <th>Total Piezas</th>
        <th>Total Kilos</th>
    `;
    Encabezados.appendChild(headerRegistro); // Colocar el encabezado con las columnas necesarias en la tabla

    // Recorrer los registros y crear elementos para mostrarlos
    products.forEach(product => {
        const registroTable = document.createElement("tr"); // crear una fila para cada fila retornada

        // Convertir la fecha en un formato valido
        let fechaCompleta = product.fecha_registro;
        let soloFecha = fechaCompleta.split(' ')[0];

        // Agregar el contenido a la tabla de visualizacion
        registroTable.innerHTML = `
            <td style="display: none">${product.id}</td>
            <td>${soloFecha}</td>
            <td>${product.nombre_producto}</td>
            <td style="display: none">${product.producto_id}</td>
            <td>${product.cajas}</td>
            <td>${product.kilos_brutos}</td>
            <td>${product.piezas_extra}</td>
            <td>${product.destare_add}</td>
            <td>${product.total_piezas}</td>
            <td>${product.total_kilos}</td>
        `;
        Tabla.appendChild(registroTable); // colocar la fila con la informacion en la tabla
        
    });
}

function LlenarTablaC(products, encabezados, tabla){
    const Encabezados = encabezados
    const Tabla = tabla

    // limpiar el contenido
    Tabla.innerHTML = '';
    Encabezados.innerHTML = '';

    // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (products.error){
        const errorRow = document.createElement("tr"); // Crear la fila en blanco en caso de error
        const headerError = document.createElement("tr"); // Crear el encabezado en blanco en caso de error
        errorRow.innerHTML=`
            <td style="display: none"> </td>
            <td> </td>
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        headerError.innerHTML = `
            <th style="display: none"></th>
            <th></th>
            <th style="display: none"></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        `;
        Tabla.appendChild(errorRow); // Mostrar el mensaje de error en el DOM
        Encabezados.appendChild(headerError); // Colocar el encabezado en la tabla
        return;
    }

    // si no hay productos, mostrar un mensaje adecuado
    if (products.length === 0){
        const noProductRow = document.createElement("tr"); // Crear la fila en blanco en caso de no haber productos
        const headerNoProduct = document.createElement("tr"); // Crear el encabezado en blanco en caso de no haber productos
        noProductRow.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        headerNoProduct.innerHTML = `
            <td style="display: none"></td>
            <td> </td>
            <td style="display: none"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        Tabla.appendChild(noProductRow); // Colocar las filas en la tabla
        Encabezados.appendChild(headerNoProduct); // Colocar el encabezado en la tabla
        return;
    }

    const headerRegistro = document.createElement("tr"); // crear el encabezado de la tabla con las columnas necesarias
    headerRegistro.innerHTML = `
        <th style="display: none">id_origen</th>

        <th>Fecha</th>
        <th>Producto Origen</th>
        <th style="display: none">id_producto_origen</th>
        <th>Cajas Origen</th>
        <th>Kilos Brutos Origen</th>
        <th>Piezas Extras Origen</th>
        <th>Destare Adicional Origen</th>
        <th>Total Piezas Origen</th>
        <th>Total Kilos Origen</th>

        <th>Producto Destino</th>
        <th style="display: none">id_producto_destino</th>
        <th>Cajas Destino</th>
        <th>Kilos Brutos Destino</th>
        <th>Piezas extras Destino</th>
        <th>Destare Adicional Destino</th>
        <th>Total Piezas Destino</th>
        <th>Total Kilos Destino</th>
    `;
    Encabezados.appendChild(headerRegistro); // Colocar el encabezado con las columnas necesarias en la tabla

    // Recorrer los registros y crear elementos para mostrarlos
    products.forEach(product => {
        const registroTable = document.createElement("tr"); // crear una fila para cada fila retornada

        // Convertir la fecha en un formato valido
        let fechaCompleta = product.fecha_registro;
        let soloFecha = fechaCompleta.split(' ')[0];

        // Agregar el contenido a la tabla de visualizacion
        registroTable.innerHTML = `
            <td style="display: none">${product.id}</td>
            <td>${soloFecha}</td>
            <td>${product.nombre_producto_origen}</td>
            <td style="display: none">${product.producto_origen_id}</td>
            <td>${product.cajas_origen}</td>
            <td>${product.kilos_brutos_origen}</td>
            <td>${product.piezas_extra_origen}</td>
            <td>${product.destare_add_origen}</td>
            <td>${product.total_piezas_origen}</td>
            <td>${product.total_kilos_origen}</td>

            <td>${product.nombre_producto_destino}</td>
            <td style="display: none">${product.producto_destino_id}</td>
            <td>${product.cajas_destino}</td>
            <td>${product.kilos_brutos_destino}</td>
            <td>${product.piezas_extra_destino}</td>
            <td>${product.destare_add_destino}</td>
            <td>${product.total_piezas_destino}</td>
            <td>${product.total_kilos_destino}</td>
        `;
        Tabla.appendChild(registroTable); // colocar la fila con la informacion en la tabla
        
    });
}

function LlenarTablaI(products, encabezados, tabla){
    const Encabezados = encabezados
    const Tabla = tabla

    // limpiar el contenido
    Tabla.innerHTML = '';
    Encabezados.innerHTML = '';

    // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (products.error){
        const errorRow = document.createElement("tr"); // Crear la fila en blanco en caso de error
        const headerError = document.createElement("tr"); // Crear el encabezado en blanco en caso de error
        errorRow.innerHTML=`
            <td style="display: none"> </td>
            <td> </td>
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        headerError.innerHTML = `
            <th style="display: none"></th>
            <th></th>
            <th style="display: none"></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        `;
        Tabla.appendChild(errorRow); // Mostrar el mensaje de error en el DOM
        Encabezados.appendChild(headerError); // Colocar el encabezado en la tabla
        return;
    }

    // si no hay productos, mostrar un mensaje adecuado
    if (products.length === 0){
        const noProductRow = document.createElement("tr"); // Crear la fila en blanco en caso de no haber productos
        const headerNoProduct = document.createElement("tr"); // Crear el encabezado en blanco en caso de no haber productos
        noProductRow.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        headerNoProduct.innerHTML = `
            <td style="display: none"></td>
            <td> </td>
            <td style="display: none"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        Tabla.appendChild(noProductRow); // Colocar las filas en la tabla
        Encabezados.appendChild(headerNoProduct); // Colocar el encabezado en la tabla
        return;
    }

    const headerRegistro = document.createElement("tr"); // crear el encabezado de la tabla con las columnas necesarias
    headerRegistro.innerHTML = `
        <th style="display: none">id</th>
        <th>Producto</th>
        
        <th>Clave</th>
        <th>Piezas</th>
        <th>Kilos</th>
    `;
    Encabezados.appendChild(headerRegistro); // Colocar el encabezado con las columnas necesarias en la tabla

    // Recorrer los registros y crear elementos para mostrarlos
    products.forEach(product => {
        const registroTable = document.createElement("tr"); // crear una fila para cada fila retornada

        // Agregar el contenido a la tabla de visualizacion
        registroTable.innerHTML = `
            <td style="display: none">${product.id}</td>
            <td>${product.nombre_producto}</td>

            <td>${product.clave}</td>
            <td>${product.piezas_actuales}</td>
            <td>${product.kilos_actuales}</td>
        `;
        Tabla.appendChild(registroTable); // colocar la fila con la informacion en la tabla
        
    });
}

export function ColocarProductosEnLista(products){
    // declarar la lista que se va a llenar
    const Lista = document.getElementById("productoDestinoF_gestor");
    Lista.innerHTML = ''; // Limpiar el contenido de la lista

    //  Crear y añadir la opción predeterminada
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.selected = true; // Hace que esta opción sea la seleccionada por defecto
    defaultOption.disabled = true; // Impide que el usuario seleccione esta opción
    defaultOption.textContent = "Selecciona un producto";
    Lista.appendChild(defaultOption);

    // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (products.error) {
        return;
    }
    // Si no hay productos, mostrar un mensaje adecuado
    if (products.length == 0){
        return;
    }

     // Recorrer los productos y crear elementos para mostrarlos
    products.forEach(product => {
        const optionElement = document.createElement("option"); // Crea un nuevo elemento <option>
        optionElement.value = product.id; // Asigna el valor del option (ej. el ID del producto)
        optionElement.textContent = product.nombre_producto; // Asigna el texto visible del option

        Lista.appendChild(optionElement); // Agrega el <option> a la lista
    });
}

export function LlenarListaConDatos(Datos){
    //console.log(Datos);
    // declarar la casilla del filtro
    const filtro = document.getElementById("productoF_gestor");
    // declarar la lista que se va a llenar
    const Lista = document.getElementById("listaResultadosGestor");
    Lista.innerHTML = ''; // Limpiar el contenido de la lista

     // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (Datos.error) {
        const errorlist = document.createElement("li"); // Crear el item en blanco en caso de error
        errorlist.innerText = 'error al buscar los datos';
        Lista.appendChild(errorlist); // Mostrar el mensaje de error en el DOM
        return;
    }
    // Si no hay productos, mostrar un mensaje adecuado
    if (Datos.length == 0){
        const noProductlist = document.createElement("li"); // Crear el item en blanco en caso de error
        noProductlist.innerText = 'no hay datos disponibles';
        Lista.appendChild(noProductlist); // Mostrar el mensaje de error en el DOM
        return;
    }
    if (filtro.value != ""){
        // Recorrer los productos y crear elementos para mostrarlos
        Datos.forEach(Dato => {
            const productList = document.createElement("li"); // Crear una fila para cada fila retornada
            // Agregar contenido a la tarjeta del producto
            productList.innerText = `${Dato.nombre_producto}`;

            Lista.appendChild(productList);

            // Agregar un evento para cada una de las filas
            productList.addEventListener('click', () => {
                ColocarSeleccionEnCasillas(Dato.id, Dato.nombre_producto);
            });
        });
    } else{
        document.getElementById("id_productoF_gestor").value = ""
    }
}