
export function ColocarProductosEnLista(products){
    // declarar la lista que se va a llenar
    const Lista = document.getElementById("productoF_entradas");
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