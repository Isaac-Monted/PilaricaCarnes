<!-- views/gestor/index.php -->
<head>
    <title>Salidas</title>
</head>

<body>
    <div>
        <div>
            <h2>Salidas de inventario</h2>
        </div>
        <div class="filtros">
            <p>Filtros</p>
            <div>
                <div>
                    <label for="fechaF_salidas">Fecha:</label>
                    <input type="date" id="fechaF_salidas" name="fechaF_salidas">
                </div>
                <div>
                    <label for="productoF_salidas">Producto:</label>
                    <select id="productoF_salidas" name="productoF_salidas">
                        <option value="opcion1">Opción 1</option>
                    </select>
                </div>
            </div>
        </div>
        <div>
            <h3>Salidas registradas</h3>
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
            <button id="agregar_salidas" name="agregar_salidas">Agregar</button>
            <button id="limpiar_salidas" name="limpiar_salidas">Limpiar</button>
            <button id="editar_salidas" name="editar_salidas">Editar</button>
            <button id="eliminar_salidas" name="eliminar_salidas">Eliminar</button>
        </div>
        <div>
            <div>
                <input type="hidden" id="id_salidas" name="id_salidas">
                <div>
                    <label for="nombre_salidas">Producto</label>
                    <input type="text" id="nombre_salidas" name="nombre_salidas">
                    <input type="hidden" id="id_producto" name="id_producto">
                </div>
                <div>
                    <div>
                        <label for="cajas_salidas">Caja</label>
                        <input type="text" id="cajas_salidas" name="cajas_salidas">
                    </div>
                    <div>
                        <label for="kilosB_salidas">Kilos Brutos</label>
                        <input type="text" id="kilosB_salidas" name="kilosB_salidas">
                    </div>
                    <div>
                        <label for="piezasE_salidas">Piezas Extra</label>
                        <input type="text" id="piezasE_salidas" name="piezasE_salidas">
                    </div>
                    <div>
                        <label for="destareA_salidas">Destare Adicional</label>
                        <input type="text" id="destareA_salidas" name="destareA_salidas">
                    </div>
                    <div>
                        <label for="totalP_salidas">Total Piezas</label>
                        <input type="text" id="totalP_salidas" name="totalP_salidas">
                    </div>
                    <div>
                        <label for="totalK_salidas">Total Kilos</label>
                        <input type="text" id="totalK_salidas" name="totalK_salidas">
                    </div>
                    <div>
                        <label for="Observaciones_salidas">Observacione</label>
                        <textArea type="text" id="Observaciones_salidas" name="Observaciones_salidas"></textarea>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </div>
</body>

<script type="module">
    import * as funciones from './views/salidas/functions.js';
    document.getElementById("agregar_salidas").addEventListener("click", function (){
        funciones.AgregarArticulo();
    });

    document.getElementById("limpiar_salidas").addEventListener("click", function (){
        funciones.LimpiarArticulo();
    });

    document.getElementById("editar_salidas").addEventListener("click", function (){
        funciones.EditarArticulo();
    });

    document.getElementById("eliminar_salidas").addEventListener("click", function (){
        funciones.EliminarArticulo();
    });
</script>