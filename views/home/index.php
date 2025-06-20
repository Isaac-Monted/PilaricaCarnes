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

<!-- views/home/index.php -->
<head>
    <title>Inicio</title>
</head>

<body>
    <div> <!-- columna principal -->
        <div>
            <h2>Bienvenido</h2>
            <p>Paginas de la aplicacion: </p>
        </div>
        <div>
            <ul class="botonera">
            <li>
                <a href="/carnes/productos">Productos</a>
            </li>
            <li>
                <a href="/carnes/entradas">Entradas inventario</a>
            </li>
            <li>
                <a href="/carnes/salidas">Salidas inventario</a>
            </li>
            <li>
                <a href="/carnes/cambios">Cambios de presentacion</a>
            </li>
            <li>
                <a href="/carnes/gestor">Gestor de movimientos</a>
            </li>
            <li>
                <a href="/carnes/">Cerrar sesion</a>
            </li>
        </ul>
        </div>
    </div>
</body>

<script type="module">
    import * as funciones from './views/login/functions.js';

</script>

