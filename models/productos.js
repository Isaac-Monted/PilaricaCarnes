import { ColocarDatosEnCasillas, LimpiarProductos } from '../views/productos/functions.js';

export function LlenarTabla(products){
    const Tabla = document.getElementById("contenedorTablaProductos");// El contenedor donde se mostrarán la tabla
    Tabla.innerHTML = ''; // Limpiar el contenedor para agregar la informacion
    const productTable = document.createElement("tr"); // button

    // Comprobar si hay un error en los datos (por ejemplo, "error" en la respuesta)
    if (products.error) {
        productTable.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        Tabla.appendChild(productTable); // Mostrar el mensaje de error en el DOM
        return;
    }

    // Si no hay productos, mostrar un mensaje adecuado
    if (products.length === 0) {
        productTable.innerHTML = `
            <td style="display: none"> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
        `;
        Tabla.appendChild(productTable);
        return;
    }

    // Recorrer los productos y crear elementos para mostrarlos
    products.forEach(product => {
        // Agregar contenido a la tarjeta del producto
        productTable.innerHTML = `
            <td style="display: none">${product.id}</td>
            <td>${product.nombre_producto}</td>
            <td>${product.descripcion}</td>
            <td>${product.clave}</td>
            <td>${product.presentacion}</td>
            <td>${product.peso_x_pieza}</td>
            <td>${product.piezas_x_caja}</td>
            <td>${product.precio}</td>
            <td>${product.piezas_iniciales}</td>
            <td>${product.kilos_iniciales}</td>
            <td>${product.estado}</td>
        `;

        Tabla.appendChild(productTable);

        // Agregar un evento para cada una de las filas
        productTable.addEventListener('click', () => {
            ColocarDatosEnCasillas(product.id);
        });
    });
}

export function ColocarDatos(Datos){
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

    if (Datos.error){
        LimpiarProductos();
        return;
    }

    if (Datos.length === 0){
        LimpiarProductos();
        return;
    }

    Datos.forEach(dato =>{
        console.log(dato);
        productosElements.id.value = dato.id;
        productosElements.producto.value = dato.nombre_producto;
        productosElements.descripcion.value = dato.descripcion;
        productosElements.clave.value = dato.clave;
        productosElements.presentacion.value = dato.presentacion;
        productosElements.pesoXpz.value = dato.peso_x_pieza;
        productosElements.piezaXcja.value = dato.piezas_x_caja;
        productosElements.precio.value = dato.precio;
        productosElements.piezasInit.value = dato.piezas_iniciales;
        productosElements.kilosInit.value = dato.kilos_iniciales;
        productosElements.estado.value = dato.estado;
    });
}