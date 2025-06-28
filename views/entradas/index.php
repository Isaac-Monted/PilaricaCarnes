<?php
// Verifica si la cookie no existe o es inválida
if (!isset($_COOKIE['acceso']) || $_COOKIE['acceso'] !== 'true') {
    // Redirige al login
    echo "<script>
        alert('Por favor inicie sesión');
        window.location.href = '/carnes/';
    </script>";
    exit;
}
?>

<!-- views/entradas/index.php -->
<head>
    <title>Entradas</title>
</head>

<body>
    <div>
        <div>
            <h2>Entradas de inventario</h2>
        </div>
        <div class="filtros">
            <p>Filtros</p>
            <div>
                <div>
                    <label for="fechaF_entradas">Fecha:</label>
                    <input type="date" id="fechaF_entradas" name="fechaF_entradas">
                </div>
                <div>
                    <label for="productoF_entradas">Producto:</label>
                    <select id="productoF_entradas" name="productoF_entradas">
                        <option value="1"></option>
                    </select>
                </div>
                <div>
                    <button id="filtrar_entradas" name="filtrar_entradas">🔎</button>
                </div>
            </div>
        </div>
        <div>
            <h3>Entradas registradas</h3>
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
                    <tbody id="contenedorTablaEntradas">
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
            <button id="agregar_entradas" name="agregar_entradas">Agregar</button>
            <button id="limpiar_entradas" name="limpiar_entradas">Limpiar</button>
            <button id="editar_entradas" name="editar_entradas">Editar</button>
            <button id="eliminar_entradas" name="eliminar_entradas">Eliminar</button>
        </div>
        <div>
            <div>
                <input type="hidden" id="id_entradas" name="id_entradas">
                <div>
                    <label for="id_producto_entradas">Producto</label>
                    <input type="hidden" id="id_producto_entradas" name="id_producto_entradas">
                    <section class="filtroDeLista">
                        <input type="search" id="nombre_entradas" name="nombre_entradas" class="campoBusqueda">
                        <ul id="listaResultadosEntradas" class="listaResultados"></ul>
                    </section>
                </div>
                <div>
                    <div>
                        <label for="cajas_entradas">Caja</label>
                        <input type="number" id="cajas_entradas" name="cajas_entradas">
                    </div>
                    <div>
                        <label for="kilosB_entradas">Kilos Brutos</label>
                        <input type="number" id="kilosB_entradas" name="kilosB_entradas">
                    </div>
                    <div>
                        <label for="piezasE_entradas">Piezas Extra</label>
                        <input type="number" id="piezasE_entradas" name="piezasE_entradas">
                    </div>
                    <div>
                        <label for="destareA_entradas">Destare Adicional</label>
                        <input type="number" id="destareA_entradas" name="destareA_entradas">
                    </div>
                    <div>
                        <label for="totalP_entradas">Total Piezas</label>
                        <input type="number" id="totalP_entradas" name="totalP_entradas" readonly>
                    </div>
                    <div>
                        <label for="totalK_entradas">Total Kilos</label>
                        <input type="number" id="totalK_entradas" name="totalK_entradas" readonly>
                    </div>
                    <div>
                        <label for="Observaciones_entradas">Observacione</label>
                        <textArea type="text" id="Observaciones_entradas" name="Observaciones_entradas"></textarea>
                    </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </div>
</body>

<script type="module">
    import * as funciones from './views/entradas/functions.js';
    // ========= BOTONES =========
    document.getElementById("filtrar_entradas").addEventListener("click", function (){
        funciones.AplicarFiltros();
    });

    document.getElementById("agregar_entradas").addEventListener("click", function (){
        funciones.AgregarEntrada();
    });

    document.getElementById("limpiar_entradas").addEventListener("click", function (){
        funciones.LimpiarAllEntradas();
    });

    document.getElementById("editar_entradas").addEventListener("click", function (){
        funciones.EditarEntrada();
    });

    document.getElementById("eliminar_entradas").addEventListener("click", function (){
        funciones.EstadoEntrada();
    });

    // ========= CASILLAS =========
    //casilla de seleccion de producto
    document.getElementById("nombre_entradas").addEventListener("input", function (){
        const Search = document.getElementById("nombre_entradas");
        funciones.SeleccionarProducto(Search.value);
    });
    document.getElementById("nombre_entradas").addEventListener("focus", function () {
        setTimeout(() => funciones.focoCasilla(true), 200);
    });
    document.getElementById("nombre_entradas").addEventListener("blur", function () {
        setTimeout(() =>funciones.focoCasilla(false), 200);
    });
    // casilla de cajas
    document.getElementById("cajas_entradas").addEventListener("input", function(){
        funciones.CalcularCamposCalculados();
    });
    // casilla de kilos brutos
    document.getElementById("kilosB_entradas").addEventListener("input", function(){
        funciones.CalcularCamposCalculados();
    });
    // casilla de piezas extras
    document.getElementById("piezasE_entradas").addEventListener("input", function(){
        funciones.CalcularCamposCalculados();
    });
    // casilla de destare adicional
    document.getElementById("destareA_entradas").addEventListener("input", function(){
        funciones.CalcularCamposCalculados();
    });
</script>