<?php
// Cargar rutas
require './routes.php';

// Obtener la URL solicitada
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];


// Ruta base del proyecto
$basePath = '/carnes';

// Eliminar el prefijo /carnes de la URI solicitada
if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

// Limpiar barra final (y si queda vacío, dejar como '/')
$uri = rtrim($uri, '/');
$uri = $uri === '' ? '/' : $uri;

// Buscar la ruta en la tabla de rutas
$routeFound = false;

// Colocamos el encabezado de la pagina
require_once './views/layouts/header.php';

foreach ($routes as $route) {
    if ($route['method'] === $method && $route['uri'] === $uri) {
        $routeFound = true;
        call_user_func($route['action']);
        break;
    }
}

if (!$routeFound) {
    http_response_code(404);
    require_once './views/error/404.php';
}

# Colocamos el pie de pagina de la pagina
require_once './views/layouts/footer.php';
?>
