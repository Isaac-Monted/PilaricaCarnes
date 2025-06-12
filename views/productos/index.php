<!-- views/products/index.php -->
<head>
    <title>Productos</title>
</head>

<body>
    <div>
        <div>
            <h2>Catalogo de productos</h2>
        </div>
        <div class="filtros">
            <p>Filtros</p>
            <div>
                <div>
                    <label for="productoF_productos">Producto:</label>
                    <input type="search" id="productoF_productos" name="productoF_productos">
                </div>
            </div>
        </div>
        <div>
            <h3>Productos registradas</h3>
            <div class="contenedorTabla">
                <table>
                    <thead>
                        <tr>
                            <th style="display: none">id</th>
                            <th>Producto</th>
                            <th>Descripcion</th>
                            <th>Clave</th>
                            <th>Presentacion</th>
                            <th>Peso x Pieza</th>
                            <th>Piezas x Caja</th>
                            <th>Precio</th>
                            <th>piezas iniciales</th>
                            <th>Kilos Iniciales</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody id="contenedorTablaProductos">
                        <tr>
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
                        </tr>
                    </tbody>
                    <tfoot></tfoot>
                </table>
            </div>
        </div>
        <div>
            <p>Acciones</p>
            <button id="agregar_productos" name="agregar_productos">Agregar</button>
            <button id="limpiar_productos" name="limpiar_productos">Limpiar</button>
            <button id="editar_productos" name="editar_productos">Editar</button>
            <button id="eliminar_productos" name="eliminar_productos">Eliminar</button>
        </div>
        <div>
            <div>
                <input type="hidden" id="id_productos" name="id">
                <div>
                    <label for="producto_productos">Producto</label>
                    <input type="text" id="producto_productos" name="producto_productos">
                </div>
                <div>
                    <div>
                        <label for="descripcion_productos">Descripcion</label>
                        <input type="text" id="descripcion_productos" name="descripcion_productos">
                    </div>
                    <div>
                        <label for="clave_productos">Clave</label>
                        <input type="text" id="clave_productos" name="clave_productos">
                    </div>
                    <div>
                        <label for="presentacion_productos">Presentacion</label>
                        <input type="text" id="presentacion_productos" name="presentacion_productos">
                    </div>
                    <div>
                        <label for="pesoXpz_productos">Peso x Pieza</label>
                        <input type="number" id="pesoXpz_productos" name="pesoXpz_productos">
                    </div>
                    <div>
                        <label for="piezaXcja_productos">Pieza x Caja</label>
                        <input type="number" id="piezaXcja_productos" name="piezaXcja_productos">
                    </div>
                    <div>
                        <label for="precio_productos">Precio</label>
                        <input type="number" id="precio_productos" name="precio_productos">
                    </div>
                    <div>
                        <label for="piezasInit_productos">Piezas Iniciales</label>
                        <input type="number" id="piezasInit_productos" name="piezasInit_productos">
                    </div>
                    <div>
                        <label for="kilosInit_productos">Kilos Iniciales</label>
                        <input type="number" id="kilosInit_productos" name="kilosInit_productos">
                    </div>
                    <div>
                        <label for="estado_productos">Estado:</label>
                        <select id="estado_productos" name="estado_productos">
                            <option value="" selected disabled>Selecciona el estado del producto</option>
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </div>
</body>

<script type="module">
    import * as funciones from './views/productos/functions.js';
    document.getElementById("agregar_productos").addEventListener("click", function (){
        funciones.AgregarProductos();
    });

    document.getElementById("limpiar_productos").addEventListener("click", function (){
        funciones.LimpiarProductos();
    });

    document.getElementById("editar_productos").addEventListener("click", function (){
        funciones.EditarProductos();
    });

    document.getElementById("eliminar_productos").addEventListener("click", function (){
        funciones.EliminarProductos();
    });

    document.getElementById("productoF_productos").addEventListener("input", function(){
        const busqueda = document.getElementById("productoF_productos");
        funciones.FitroBuscarProducto(busqueda.value);
    });
</script>