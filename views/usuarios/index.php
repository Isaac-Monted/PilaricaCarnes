<!-- views/gestor/index.php -->
<head>
    <title>Usuario</title>
</head>

<body>
    <div>
        <div>
            <h2>Usuarios del Sistema</h2>
        </div>
        <div class="filtros">
            <p>Filtros</p>
            <div>
                <div>
                    <label for="usuariosF_usuarios">Usuario:</label>
                    <input type="search" id="usuariosF_usuarios" name="usuariosF_usuarios">
                </div>
            </div>
        </div>
        <div>
            <h3>Usuarios registrados</h3>
            <div class="contenedorTabla">
                <table>
                    <thead>
                        <tr>
                            <th style="display: none">id</th>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Apellido P</th>
                            <th>Apellido M</th>
                            <th>Correo</th>
                            <th>Telefono</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody id="contenedorTablaUsuarios">
                        <tr>
                            <td style="display: none"> </td>
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
            <button id="agregar_usuarios" name="agregar_usuarios">Agregar</button>
            <button id="limpiar_usuarios" name="limpiar_usuarios">Limpiar</button>
            <button id="editar_usuarios" name="editar_usuarios">Editar</button>
            <button id="eliminar_usuarios" name="eliminar_usuarios">Eliminar</button>
        </div>
        <div>
            <div>
                <input type="hidden" id="id_usuarios" name="id_usuarios">
                <div>
                    <label for="usuario_usuarios">Usuario</label>
                    <input type="text" id="usuario_usuarios" name="usuario_usuarios">
                </div>
                <div>
                    <div>
                        <label for="nombre_usuarios">Nombre</label>
                        <input type="text" id="nombre_usuarios" name="nombre_usuarios">
                    </div>
                    <div>
                        <label for="apellidoP_usuarios">Apellido Paterno</label>
                        <input type="text" id="apellidoP_usuarios" name="apellidoP_usuarios">
                    </div>
                    <div>
                        <label for="apellidoM_usuarios">Apellido Materno</label>
                        <input type="text" id="apellidoM_usuarios" name="apellidoM_usuarios">
                    </div>
                    <div>
                        <label for="contrasena_usuarios">contraseña</label>
                        <div class="login-password-wrapper">
                            <input type="password" id="contrasena_usuarios" name="contrasena_usuarios" class="login-input" required>
                            <button id="mostrarcontrasena_usuarios" class="login-show-password-btn" title="Mostrar contraseña">👁️</button>
                        </div>
                    </div>
                    <div>
                        <label for="correo_usuarios">Correo</label>
                        <input type="text" id="correo_usuarios" name="correo_usuarios">
                    </div>
                    <div>
                        <label for="telefono_usuarios">Telefono</label>
                        <input type="text" id="telefono_usuarios" name="telefono_usuarios">
                    </div>
                    <div>
                        <label for="estado_usuarios">Estado:</label>
                        <select id="estado_usuarios" name="estado_usuarios">
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
    import * as funciones from './views/usuarios/functions.js';
    // ========= BOTONES =========
    document.getElementById("mostrarcontrasena_usuarios").addEventListener("click", function () {
        funciones.MostrarContrasena();
    });

    document.getElementById("agregar_usuarios").addEventListener("click", function (){
        funciones.AgregarUsuario();
    });

    document.getElementById("limpiar_usuarios").addEventListener("click", function (){
        funciones.LimpiarUsuarios();
    });

    document.getElementById("editar_usuarios").addEventListener("click", function (){
        funciones.EditarUsuario();
    });

    document.getElementById("eliminar_usuarios").addEventListener("click", function (){
        funciones.EliminarUsuario();
    });

    // ========= CASILLAS =========
    document.getElementById("usuariosF_usuarios").addEventListener("input", function(){
        const busqueda = document.getElementById("usuariosF_usuarios");
        funciones.FitroBuscarUsuario(busqueda.value);
    });
</script>