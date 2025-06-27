<!-- views/gestor/index.php -->
<head>
    <title>Gestor</title>
</head>

<body>
    <div>
        <div>
            <h2>Gestor de inventario</h2>
        </div>
        <div class="filtros">
            <p>Filtros</p>
            <div>
                <div>
                    <label for="fechaInitF_gestor">Fecha Inicio:</label>
                    <input type="date" id="fechaInitF_gestor" name="fechaInitF_gestor">
                </div>
                <div>
                    <label for="fechaFinalF_gestor">Fecha Termino:</label>
                    <input type="date" id="fechaFinalF_gestor" name="fechaFinalF_gestor" disabled>
                </div>
            </div>
            <div>
                <div>
                    <label for="productoF_gestor">Producto:</label>
                    <input type="hidden" id="id_productoF_gestor" name="id_producto_gestor">
                    <section class="filtroDeLista" style="width: 100%">
                        <input type="search" id="productoF_gestor" name="productoF_gestor">
                        <ul id="listaResultadosGestor" class="listaResultados"></ul>
                    </section>
                </div>
                <div>
                    <label for="productoDestinoF_gestor">Producto Destino:</label>
                    <select id="productoDestinoF_gestor" name="productoDestinoF_gestor" disabled>
                        <option value="1"></option>
                    </select>
                </div>
            </div>
            <div>
                <label for="movimientoF_gestor">movimiento:</label>
                <select id="movimientoF_gestor" name="movimientoF_gestor">
                    <option value="" selected disabled>Selecciona un movimiento</option>
                    <option value="Entradas">Entradas</option>
                    <option value="Salidas">Salidas</option>
                    <option value="Cambios">Cambios de presentacion</option>
                    <option value="Inventario">Inventario</option>
                </select>
            </div>
            <div>
                <label for="agrupacionF_gestor">Agrupacion:</label>
                <select id="agrupacionF_gestor" name="agrupacionF_gestor" disabled>
                    <option value="" selected disabled>Selecciona una agrupacion</option>
                    <option value="true">Agrupado</option>
                    <option value="false">Separado</option>
                </select>
            </div>
            <div>
                <label for="estadoF_gestor">Estado:</label>
                <select id="estadoF_gestor" name="estadoF_gestor" disabled>
                    <option value="" selected disabled>Selecciona un estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
            <div>
                <label for="orientacionF_gestor">Orientacion:</label>
                <select id="orientacionF_gestor" name="orientacionF_gestor" disabled>
                    <option value="" selected disabled>Selecciona la orientacion</option>
                    <option value="ASC">Ascendente</option>
                    <option value="DESC">Descendente</option>
                </select>
            </div>
            <div>
                <button id="filtrar_gestor" name="filtrar_gestor">🔎 Buscar </button>
                <button id="limpiar_gestor" name="limpiar_gestor">🧹 Limpiar</button>
            </div>
        </div>
        <div>
            <h3>Gestion de Movimientos</h3>
            <div class="contenedorTabla">
                <table>
                    <thead id="contenedorTablagestor">
                        <tr>
                            <th style="display: none"></th>
                            <th></th>
                            <th style="display: none"></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="contenedorTablagestor">
                        <tr>
                            <td style="display: none"></td>
                            <td> </td>
                            <td style="display: none"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                    <tfoot></tfoot>
                </table>
            </div>
        </div>

    </div>
</body>

<script type="module">
    import * as funciones from './views/gestor/functions.js';
    // ========= EVENTOS =========
    document.getElementById("movimientoF_gestor").addEventListener("input", function (){
        const movimineto = document.getElementById("movimientoF_gestor").value;
        funciones.DetectarMovimiento(movimineto);
    });
    // ========= BOTONES =========
    document.getElementById("filtrar_gestor").addEventListener("click", function(){
        funciones.FiltrarInformacion();
    });
    document.getElementById("limpiar_gestor").addEventListener("click", function(){
        funciones.LimpiarGestor();
    });
    // ========= CASILLAS =========
    //casilla de seleccion de producto
    document.getElementById("productoF_gestor").addEventListener("input", function (){
        const Search = document.getElementById("productoF_gestor");
        funciones.SeleccionarProducto(Search.value);
    });
    document.getElementById("productoF_gestor").addEventListener("focus", function (){
        setTimeout(() => funciones.focoCasilla(true), 200);
    });
    document.getElementById("productoF_gestor").addEventListener("blur", function (){
        setTimeout(() =>funciones.focoCasilla(false), 200);
    });
</script>