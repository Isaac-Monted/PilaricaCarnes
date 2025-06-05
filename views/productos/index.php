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
                    <label for="fechaF_productos">Fecha:</label>
                    <input type="date" id="fechaF_productos" name="fechaF_productos">
                </div>
                <div>
                    <label for="productoF_productos">Producto:</label>
                    <select id="productoF_productos" name="productoF_productos">
                        <option value="opcion1">Opción 1</option>
                    </select>
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
                            <th style="display: none">id_producto</th>
                            <th>Cajas</th>
                            <th>Kilos Brutos</th>
                            <th>Piezas extras</th>
                            <th>Destare Adicional</th>
                            <th>Total Piezas</th>
                            <th>Total Kilos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="display: none"> </td>
                            <td> </td>
                            <td style="display: none"> </td>
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
                <input type="hidden" id="id_productos" name="id_productos">
                <div>
                    <label for="nombre_productos">Producto</label>
                    <input type="text" id="nombre_productos" name="nombre_productos">
                    <input type="hidden" id="id_producto" name="id_producto">
                </div>
                <div>
                    <div>
                        <label for="cajas_productos">Caja</label>
                        <input type="text" id="cajas_productos" name="cajas_productos">
                    </div>
                    <div>
                        <label for="kilosB_productos">Kilos Brutos</label>
                        <input type="text" id="kilosB_productos" name="kilosB_productos">
                    </div>
                    <div>
                        <label for="piezasE_productos">Piezas Extra</label>
                        <input type="text" id="piezasE_productos" name="piezasE_productos">
                    </div>
                    <div>
                        <label for="destareA_productos">Destare Adicional</label>
                        <input type="text" id="destareA_productos" name="destareA_productos">
                    </div>
                    <div>
                        <label for="totalP_productos">Total Piezas</label>
                        <input type="text" id="totalP_productos" name="totalP_productos">
                    </div>
                    <div>
                        <label for="totalK_productos">Total Kilos</label>
                        <input type="text" id="totalK_productos" name="totalK_productos">
                    </div>
                    <div>
                        <label for="Observaciones_productos">Observacione</label>
                        <textArea type="text" id="Observaciones_productos" name="Observaciones_productos"></textarea>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </div>
</body>