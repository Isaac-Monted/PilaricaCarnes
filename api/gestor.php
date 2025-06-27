<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cargar el autoload de Composer
require __DIR__ . '/../vendor/autoload.php';

// Importar la coneccion al servidor
require '../api/db.php';

// Crear conexion
$conn = Database::connect();

// Verificar si no hubo errores de conexion
if($conn->connect_error){
    die("Conexion faliifa " . $conn->connect_error);
}

// ================================= FUNCIONES =================================
function FiltarEntradas($conn, $filters = []) {
    $queryBase = "
        SELECT
            Carnes_entradas.id,
            Carnes_entradas.fecha_registro,
            Carnes_productos.nombre_producto,
            Carnes_entradas.producto_id,
            Carnes_entradas.cajas,
            Carnes_entradas.kilos_brutos,
            Carnes_entradas.piezas_extra,
            Carnes_entradas.destare_add,
            Carnes_entradas.total_piezas,
            Carnes_entradas.total_kilos,
            Carnes_entradas.observaciones,
            Carnes_entradas.fecha_modificacion,
            Carnes_entradas.fecha_creacion
            from Carnes_entradas
        INNER JOIN
            Carnes_productos
            ON Carnes_entradas.producto_id = Carnes_productos.id
    ";

    $queryAgrupacion = "
                        SELECT
                            MAX(Carnes_entradas.id) AS id,
                            MAX(Carnes_entradas.fecha_registro) AS fecha_registro,
                            MAX(Carnes_productos.nombre_producto) AS nombre_producto,
                            Carnes_entradas.producto_id,
                            SUM(Carnes_entradas.cajas) AS cajas,
                            SUM(Carnes_entradas.kilos_brutos) AS kilos_brutos,
                            SUM(Carnes_entradas.piezas_extra) AS piezas_extra,
                            SUM(Carnes_entradas.destare_add) AS destare_add,
                            SUM(Carnes_entradas.total_piezas) AS total_piezas,
                            SUM(Carnes_entradas.total_kilos) AS total_kilos,
                            MAX(Carnes_entradas.observaciones) AS observaciones,
                            MAX(Carnes_entradas.fecha_modificacion) AS fecha_modificacion,
                            MAX(Carnes_entradas.fecha_creacion) AS fecha_creacion
                            from Carnes_entradas
                        INNER JOIN
                            Carnes_productos
                            ON Carnes_entradas.producto_id = Carnes_productos.id
                    ";


    $Params = [];
    $types = [];
    $fechas = [];

    // Opcionales
    $groupBy = null;
    $orderBy = 'id';
    $orderDir = "ASC"; // Valor por defecto
    $usarAgrupacion = false;


    // si hay filtros constuimos el where
    if (!empty($filters)){
        $conditions = [];

        foreach ($filters as $field => $value){
            //PRODUCTO
            if($field === "producto_texto"){
                $conditions[] = "Carnes_productos.nombre_producto LIKE ?";
                $Params[] = "%" . $value . "%"; // añadir los comodines aqui
                $types[] = "s";
            }
            // FECHAS
            if ($field === "fecha_inicio") {
                $fechas['inicio'] = $value;
            }
            if ($field === "fecha_termino") {
                $fechas['termino'] = $value;
            }
            //ESTADO
            if($field === "estado"){
                $conditions[] = "Carnes_entradas.$field = ?";
                $Params[] = $value;
                $types[] = "s";
            }
            //AGRUPACION
            if ($field === "agrupacion") {
                if($value === true){
                    $usarAgrupacion = $value;
                    $groupBy = 'producto_id'; // Colocar la columna de agrupacion
                } else {
                    $groupBy = null; // Vacio si no es verdadero
                }
            }
            //DIRECCION
            if ($field === "orientacion") {
                $dir = strtoupper($value);
                if (in_array($dir, ['ASC', 'DESC'])) {
                    $orderDir = $dir;
                }
            }
        }

        // Agregar condición de fechas si están presentes
        if (!empty($fechas['inicio']) && !empty($fechas['termino'])) {
            $conditions[] = "Carnes_entradas.fecha_registro BETWEEN ? AND ?";
            $Params[] = $fechas['inicio'];
            $Params[] = $fechas['termino'];
            $types[] = "s";
            $types[] = "s";
        } elseif (!empty($fechas['inicio'])) {
            $conditions[] = "Carnes_entradas.fecha_registro >= ?";
            $Params[] = $fechas['inicio'];
            $types[] = "s";
        } elseif (!empty($fechas['termino'])) {
            $conditions[] = "Carnes_entradas.fecha_registro <= ?";
            $Params[] = $fechas['termino'];
            $types[] = "s";
        }

        // Armamos la query según agrupación
        $query = $usarAgrupacion ? $queryAgrupacion : $queryBase;
        // validamos si hay condiciones
        if (!empty($conditions)) {
            // Colocamos las condiciones
            $query .= " WHERE " . implode(" AND ", $conditions);
        }
    } else {
        $query = $queryBase;
    }

    // Agrupación (GROUP BY)
    if (!empty($groupBy)) {
        $query .= " GROUP BY Carnes_entradas." . $conn->real_escape_string($groupBy);
    }

    // Ordenamiento (ORDER BY)
    if (!empty($orderBy)) {
        $query .= " ORDER BY Carnes_entradas." . $conn->real_escape_string($orderBy) . " " . $orderDir;
    }

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        return "Error en la preparacion de la coinsulta: " . $conn->error;
    }

    // Vinculamos los parametros
    if(!empty($Params)){
        $stmt->bind_param(implode("", $types), ...$Params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $comentarios = [];
    while ($row = $result->fetch_assoc()){
        $comentarios[] = $row;
    }
    return $comentarios;
    $stmt->close();
}

function FiltrarSalidas() {
    
}

function FiltrarCambios() {
    
}

function CalcularInventario() {
    
}

// ================================= ENRUTAMIENTO =================================
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    // Definir un array para almacenar las respuestas
    $data = [];

    // Dependiendo de la acción solicitada, ejecutar la función correspondiente
    switch ($action) {
        case 'main':
            // Llamar a la función para editar el correo en la base de datos
            $result = '';

            // Procesar el resultado
            if (str_starts_with($result, "Operacion realizada")) {
                $data = ["success" => $result];
            } else {
                $data = ["error" => $result];
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