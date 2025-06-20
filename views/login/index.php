<?php
// Verificar si el usuario ya tiene la cookie 'acceso' activa
if (isset($_COOKIE['acceso']) && $_COOKIE['acceso'] === 'true') {
    // Redirige a la página principal si ya está autenticado
    header('Location: principal');
    exit;
}
?>

<!-- views/login/index.php -->
<head>
    <title>Inicio de Sesion</title>
</head>

<body>
    <div class="login-body"> <!-- columna principal -->
        <div class="login-container"> <!-- fila superior -->
            <h2>INICIO DE SESION</h2>
        </div>
        <div> <!-- fila inferior -->
            <div> <!-- formulario -->
                <div id="formCredenciales_login">
                    <div class="login-form-group"> <!-- grupo nombre -->
                        <label for="usuario_login">Ingresa tu nombre de usuario</label>
                        <input type="text" id="usuario_login" name="usuario_login" required>
                    </div>
                    
                    <div class="login-form-group"> <!-- grupo contraseña -->
                        <label for="contrsena_login">Ingresa tu contraseña</label>
                        <div class="login-password-wrapper">
                            <input type="password" id="contrsena_login" name="contrsena_login" class="login-input" required>
                            <button id="mostrarContrsena_login" class="login-show-password-btn" title="Mostrar contraseña">👁️</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="login-actions"> <!-- botones -->
                <button id="limpiar_login">Limpiar</button>
                <button id="ingresar_login">Ingresar</button>
            </div>
        </div>
    </div>
</body>

<script type="module">
    import * as funciones from './views/login/functions.js';

    document.getElementById("mostrarContrsena_login").addEventListener("click", function () {
        funciones.MostrarContrasena();
    });

    document.getElementById("limpiar_login").addEventListener("click", function () {
        funciones.LimpiarFormulario();
    });

    document.getElementById("ingresar_login").addEventListener("click", function () {
        funciones.IniciarSesion();
    });
</script>