

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

export async function BuscarProductoText(Product_text){
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

export async function BuscarUsuarioText(usuario_text) {
    // Construir el objeto de filtros
    const filters = {
        nombre_usuario_buscar: 'administrador',
    };

    // Crear un objeto URLSearchParams y añadir los filtros
    const params = new URLSearchParams();
    params.append('action', 'LeerUsuarios'); // Siempre añadir la accion

    //Codificar el objeto filtersn a JSON
    params.append('filters', JSON.stringify(filters)); // <-- Envía todo el objeto filters como una cadena JSON

    // Construir la URL completa usando template literals y params.toString()
    const url = `/../carnes/api/usuarios.php?${params.toString()}`;

    // Realizar la solicitud Ajax
    try {
        const response = await fetch(url);

        if(!response.ok){
            // Lanzar un error si el estado HTTP no fue exitoso
            throw new Error(`¡Error HTTP! Estado: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Esperar a que el JSON se parseé

        //console.log(data);
        return data;

    } catch (error){
        console.error("Error al buscar usuario:", error);
        // Retornar un array vacío o null aquí si hay un error
        return [];
    }
}