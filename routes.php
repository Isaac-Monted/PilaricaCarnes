<?php

require_once './controllers/homeController.php';
require_once './controllers/loginController.php';
require_once './controllers/gestorController.php';
require_once './controllers/entradasController.php';
require_once './controllers/salidasController.php';
require_once './controllers/cambiosController.php';
require_once './controllers/productosController.php';

$routes = [
    [
        'method' => 'GET',
        'uri' => '/inicio', // Ruta para la página principal
        'action' => 'HomeController::index',
    ],
    [
        'method' => 'GET',
        'uri' => '/', // Ruta del inicio de sesion
        'action' => 'LoginController::index'
    ],
    [
        'method' => 'GET',
        'uri' => '/gestor', // Ruta para gestor
        'action' => 'GestorController::index'
    ],
    [
        'method' => 'GET',
        'uri' => '/entradas', // Ruta para entradas
        'action' => 'EntradasController::index'
    ],
    [
        'method' => 'GET',
        'uri' => '/salidas', // Ruta para salidas
        'action' => 'SalidasController::index'
    ],
    [
        'method' => 'GET',
        'uri' => '/cambios', // Ruta para cambios de presentacion
        'action' => 'CambiosController::index'
    ],
    [
        'method' => 'GET',
        'uri' => '/productos', // Ruta para productos
        'action' => 'ProductosController::index'
    ],
];
?>