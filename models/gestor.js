import { ColocarSeleccionEnCasillas } from '../views/gestor/functions.js';

export function LlenarTabla(products){

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