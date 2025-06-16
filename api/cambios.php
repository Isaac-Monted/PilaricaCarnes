<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cargar el autoload de Composer
require __DIR__ . '/../vendor/autoload.php';

// Importar la coneccion al servidor
require '../api/db.php';

// ================================= FUNCIONES =================================
function main() {
    
}

// ================================= ENRUTAMIENTO =================================
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    // Definir un array para almacenar las respuestas
    $data = [];

    // Dependiendo de la acción solicitada, ejecutar la función correspondiente
    switch ($action) {
        case 'AgregarSalida':
            if (isset($_POST[''])){
                // Colocar los valores en las variables

                 // Llamar a la función para agregar la salida en la base de datos
                $result = '';

                // Procesar el resultado
                if (str_starts_with($result, "Operacion realizada")) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else {
                $data = ["error" => "operacion fallida"];
            }

            break;

        case 'EditarSalida':
            if (isset($_POST[''])){
                // Colocar los valores en las variables

                 // Llamar a la función para agregar la salida en la base de datos
                $result = '';

                // Procesar el resultado
                if (str_starts_with($result, "Operacion realizada")) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else {
                $data = ["error" => "operacion fallida"];
            }

            break;

        case 'LeerSalidas':
            if (isset($_POST[''])){
                // Colocar los valores en las variables

                // Procesar el resultado
                try {
                    // Llamar a la función para agregar la salida en la base de datos
                    $result = '';

                    // Procesar el resultado
                $data = $result;
                } catch(Exception $e){
                    $data = ["error" => $e->getMessage()];
                }
            } else {
                $data = ["error" => "operacion fallida"];
            }

            break;

        case 'EliminarSalida':
            if (isset($_POST[''])){
                // Colocar los valores en las variables

                 // Llamar a la función para agregar la salida en la base de datos
                $result = '';

                // Procesar el resultado
                if (str_starts_with($result, "Operacion realizada")) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else {
                $data = ["error" => "operacion fallida"];
            }

            break;

        default:
            // Si la acción no es válida, se devuelve un error
            $data = ["error" => "Accion no valida"];
            break;
    }

    // Establecer el tipo de contenido como JSON
    header('Content-Type: application/json');

    // Si no hay datos, devolver un mensaje adecuado
    if (empty($data)) {
        $data = ["error" => "No hay datos disponibles."];
    }
    // Devolver los datos en formato JSON
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    } else {
        // Si no se pasa ninguna acción, devolver un error
        echo json_encode(["error" => "Falla en la acción de la solicitud"], JSON_UNESCAPED_UNICODE);
}
?>