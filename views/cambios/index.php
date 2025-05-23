<!-- views/gestor/index.php -->
<head>
    <title>Cambios de presentacion</title>
</head>

<body>
    <div>
        <div>
            <h2>Cambios de presentacion</h2>
        </div>
        <div class="filtros">
            <p>Filtros</p>
            <div>
                <div>
                    <label for="fechaF_cambios">Fecha:</label>
                    <input type="date" id="fechaF_cambios" name="fechaF_cambios">
                </div>
                <div>
                    <label for="productoF_cambios">Producto:</label>
                    <select id="productoF_cambios" name="productoF_cambios">
                        <option value="opcion1">Opción 1</option>
                    </select>
                </div>
            </div>
        </div>
        <div>
            <h3>cambios registrados</h3>
            <div class="contenedorTabla">
                <table>
                    <thead>
                        <tr>
                            <th style="display: none">id_origen</th>

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
            <button id="agregar_cambios" name="agregar_cambios">Agregar</button>
            <button id="limpiar_cambios" name="limpiar_cambios">Limpiar</button>
            <button id="editar_cambios" name="editar_cambios">Editar</button>
            <button id="eliminar_cambios" name="eliminar_cambios">Eliminar</button>
        </div>
        <div>
            <div>
                <input type="hidden" id="id_cambios" name="id_cambios">
                <div>
                    <div>
                        <label for="nombre_cambios">Producto Origen</label>
                        <input type="text" id="nombre_cambios" name="nombre_cambios">
                        <input type="hidden" id="id_producto" name="id_producto">
                    </div>
                    <div>
                        <label for="nombre_cambios">Producto Destino</label>
                        <input type="text" id="nombre_cambios" name="nombre_cambios">
                        <input type="hidden" id="id_producto" name="id_producto">
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <label for="cajasOri_cambios">Caja Origen</label>
                            <input type="text" id="cajasOri_cambios" name="cajasOri_cambios">
                        </div>
                        <div>
                            <label for="kilosBOri_cambios">Kilos Brutos Origen</label>
                            <input type="text" id="kilosBOri_cambios" name="kilosBOri_cambios">
                        </div>
                        <div>
                            <label for="piezasEOri_cambios">Piezas Extra Origen</label>
                            <input type="text" id="piezasEOri_cambios" name="piezasEOri_cambios">
                        </div>
                        <div>
                            <label for="destareAOri_cambios">Destare Adicional Origen</label>
                            <input type="text" id="destareAOri_cambios" name="destareAOri_cambios">
                        </div>
                        <div>
                            <label for="totalPOri_cambios">Total Piezas Origen</label>
                            <input type="text" id="totalPOri_cambios" name="totalPOri_cambios">
                        </div>
                        <div>
                            <label for="totalKOri_cambios">Total Kilos Origen</label>
                            <input type="text" id="totalKOri_cambios" name="totalKOri_cambios">
                        </div>
                    </div>
                    <div>
                        <div>
                            <label for="cajasDes_cambios">Caja Destino</label>
                            <input type="text" id="cajasDes_cambios" name="cajasDes_cambios">
                        </div>
                        <div>
                            <label for="kilosBDes_cambios">Kilos Brutos Destino</label>
                            <input type="text" id="kilosBDes_cambios" name="kilosBDes_cambios">
                        </div>
                        <div>
                            <label for="piezasEDes_cambios">Piezas Extra Destino</label>
                            <input type="text" id="piezasEDes_cambios" name="piezasEDes_cambios">
                        </div>
                        <div>
                            <label for="destareADes_cambios">Destare Adicional Destino</label>
                            <input type="text" id="destareADes_cambios" name="destareADes_cambios">
                        </div>
                        <div>
                            <label for="totalPDes_cambios">Total Piezas Destino</label>
                            <input type="text" id="totalPDes_cambios" name="totalPDes_cambios">
                        </div>
                        <div>
                            <label for="totalKDes_cambios">Total Kilos Destino</label>
                            <input type="text" id="totalKDes_cambios" name="totalKDes_cambios">
                        </div>
                    </div>
                    <div>
                        <label for="Observaciones_cambios">Observacione</label>
                        <textArea type="text" id="Observaciones_cambios" name="Observaciones_cambios"></textarea>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </div>
</body>

<script type="module">
    import * as funciones from './views/cambios/functions.js';
    document.getElementById("agregar_cambios").addEventListener("click", function (){
        funciones.AgregarArticulo();
    });

    document.getElementById("limpiar_cambios").addEventListener("click", function (){
        funciones.LimpiarArticulo();
    });

    document.getElementById("editar_cambios").addEventListener("click", function (){
        funciones.EditarArticulo();
    });

    document.getElementById("eliminar_cambios").addEventListener("click", function (){
        funciones.EliminarArticulo();
    });


</script>