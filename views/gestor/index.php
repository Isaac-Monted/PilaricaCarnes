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
                    <label for="fechaF_salidas">Fecha Inicio:</label>
                    <input type="date" id="fechaF_salidas" name="fechaF_salidas">
                </div>
                <div>
                    <label for="fechaF_salidas">Fecha Termino:</label>
                    <input type="date" id="fechaF_salidas" name="fechaF_salidas">
                </div>
            </div>
            <div>
                <div>
                    <label for="usuariosF_usuarios">Producto:</label>
                    <input type="hidden" id="id_producto_salidas" name="id_producto_salidas">
                    <section class="filtroDeLista" style="width: 100%">
                        <input type="search" id="usuariosF_usuarios" name="usuariosF_usuarios">
                        <ul id="listaResultadosSalidas" class="listaResultados"><li>a</li></ul>
                    </section>
                </div>
                <div>
                    <label for="productoF_salidas">Producto Destino:</label>
                    <select id="productoF_salidas" name="productoF_salidas">
                        <option value="1"></option>
                    </select>
                </div>
            </div>
            <div>
                <label for="productoF_salidas">movimiento:</label>
                <select id="productoF_salidas" name="productoF_salidas">
                    <option value="" selected disabled>Selecciona un producto</option>
                    <option value="Entradas">Entradas</option>
                    <option value="Salidas">Salidas</option>
                    <option value="Cambios">Cambios de presentacion</option>
                    <option value="Inventario">Inventario</option>
                </select>
            </div>
            <div>
                <label for="productoF_salidas">Agrupacion:</label>
                <select id="productoF_salidas" name="productoF_salidas">
                    <option value="" selected disabled>Selecciona una agrupacion</option>
                    <option value="Agrupado">Agrupado</option>
                    <option value="Separado">Separado</option>
                </select>
            </div>
            <div>
                <label for="productoF_salidas">Estado:</label>
                <select id="productoF_salidas" name="productoF_salidas">
                    <option value="" selected disabled>Selecciona un estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
            <div>
                <label for="productoF_salidas">Orientacion:</label>
                <select id="productoF_salidas" name="productoF_salidas">
                    <option value="" selected disabled>Selecciona la orientacion</option>
                    <option value="ASC">Ascendente</option>
                    <option value="DESC">Descendente</option>
                </select>
            </div>
            <div>
                <button id="filtrar_salidas" name="filtrar_salidas">🔎 Buscar </button>
                <button id="filtrar_salidas" name="filtrar_salidas">🧹 Limpiar</button>
            </div>
        </div>
        <div>
            <h3>Gestion de Movimientos</h3>
            <div class="contenedorTabla">
                <table>
                    <thead id="contenedorTablaSalidas">
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
                    <tbody id="contenedorTablaSalidas">
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