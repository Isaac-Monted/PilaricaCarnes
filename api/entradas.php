<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cargar el autoload de Composer
require __DIR__ . '/../vendor/autoload.php';

// Importar la coneccion al servidor
require '../api/db.php';

// Crear conexion
$conn = Database::connect();

// verificar si no hubo errores de conexion
if ($conn->connect_error){
    die("Conexion fallida: " . $conn->connect_error);
}

// ================================= FUNCIONES =================================
function AgregarEntrada($conn, $fecha, $id_producto, $cajas, $kilos_brutos, $piezas_extra, $destare_add, $observaciones) {
    if (empty($fecha) || empty($id_producto)){
        return "Error: debes proporcionar los datos necesarios para agregar";
    }

    // Consulta SQL para insertar los datos en la base de datos
    $query = " INSERT IGNORE INTO Carnes_entradas (
    fecha_registro,
    producto_id,
    cajas,
    kilos_brutos,
    piezas_extra,
    destare_add,
    observaciones) VALUES (?,?,?,?,?,?,?)
    ";

    // Preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vinculamos los parametros
    $stmt->bind_param("siidids", $fecha, $id_producto, $cajas, $kilos_brutos, $piezas_extra, $destare_add, $observaciones);

    //ejecutamos la consulta
    if ($stmt->execute()){
        if ($stmt->affected_rows > 0){
            return "Operacion realizada";
        } else {
            return "Error de escritura";
        }
    } else {
        return "Error al agregar la entrada" . $stmt->error;
    }

    $stmt->close();
}

function EditarEntrada($conn, $id_entrada, $fecha, $id_producto, $cajas, $kilos_brutos, $piezas_extra, $destare_add, $observaciones) {
    if (empty($id_entrada) || empty($fecha) || empty($id_producto)){
        return "Error: debes proporcionar los datos necesarios para agregar";
    }

    // Consulta SQL para editar los datos en la base de datos
    $query = "UPDATE Carnes_entradas SET
        fecha_registro = ?,
        producto_id = ?,
        cajas = ?,
        kilos_brutos = ?,
        piezas_extra = ?,
        destare_add = ?,
        observaciones = ?
    WHERE id = ?
    ";

    // preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vinculamos los parametros
    $stmt->bind_param("siididsi", $fecha, $id_producto, $cajas, $kilos_brutos, $piezas_extra, $destare_add, $observaciones, $id_entrada);

    //ejecutamos la consulta
    if ($stmt->execute()){
        if ($stmt->affected_rows > 0){
            return "Operacion realizada";
        } else {
            return "error de escritura";
        }
    } else {
        return "Error al editar la entrada: " . $stmt->error;
    }

    $stmt->close();
}

function LeerEntradas($conn, $filters = []) {
    $query = "
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
    $Params = [];
    $types = [];

    // si hay filtros constuimos el where
    if (!empty($filters)){
        $conditions = [];

        foreach ($filters as $field => $value){
            if ($field === 'nombre_producto_buscar') {
                $conditions[] = "producto_id LIKE ?";
                $Params[] = "%" . $value . "%"; // añadir los comodines aqui
                $types[] = "s";
            } else {
                if($field === "nombre_producto"){
                    $conditions[] = "Carnes_productos.$field = ?";
                }else{
                    $conditions[] = "Carnes_entradas.$field = ?";
                }
                $Params[] = $value;

                // determinar tipo para bind_param
                if(is_int($value)){
                    $types[] = "i";
                }elseif(is_double($value)){
                    $types[] = "d";
                }else{
                    $types[] = "s"; // string por defecto
                }
            }
        }
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    $query .= " ORDER BY id DESC";

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

function EliminarEntrada($conn, $id_entrada) {
    // Verificar que $id_entrada es un numero valido
    if (!is_numeric($id_entrada)){
        return "Error al eliminar la entrada";
    }

    // Preparar la consulta SQL para eliminar el producto
    $query = "DELETE FROM Carnes_entradas WHERE id = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vincular el parametro y ejecutar la consulta
    $stmt->bind_param("i", $id_entrada);

    if ($stmt->execute()){
        if ($stmt->affected_rows > 0){
            return "Operacion realizada";
        } else {
            return "Entrada no eliminada";
        }
    } else {
        return "Error al ejecutar la operacion: " . $stmt->error;
    }

    $stmt->close();
}

function EstadoEntrada($conn, $id_salida, $estado) {
    if (!is_numeric($id_salida)){
        return "Error: debes proporcionar los datos necesarios para cambiar el estado";
    }

    // Consulta SQL para editar los datos en la base de datos
    $query = "UPDATE Carnes_entradas SET
        estado = ?
    WHERE id = ?
    ";

    // preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vinculamos los parametros
    $stmt->bind_param("si", $estado, $id_salida);

    //ejecutamos la consulta
    if ($stmt->execute()){
        if ($stmt->affected_rows > 0){
            return "Operacion realizada";
        } else {
            return "error de escritura";
        }
    } else {
        return "Error al editar la entrada: " . $stmt->error;
    }

    $stmt->close();
}

// ================================= ENRUTAMIENTO =================================
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    // Definir un array para almacenar las respuestas
    $data = [];

    // Dependiendo de la acción solicitada, ejecutar la función correspondiente
    switch ($action) {
        case 'AgregarEntrada':
            if (isset($_POST['fecha']) && isset($_POST['producto'])){
                // Colocar los valores en las variables
                $fecha = $_POST['fecha'];
                $producto = $_POST['producto'];
                $cajas = !empty($_POST['cajas']) ? $_POST['cajas'] : 0;
                $kilosBrutos = !empty($_POST['kilosBrutos']) ? $_POST['kilosBrutos'] : 0.0;
                $piezasExtra = !empty($_POST['piezasExtra']) ? $_POST['piezasExtra'] : 0;
                $destareAdd = !empty($_POST['destareAdd']) ? $_POST['destareAdd'] : 0.0;
                $observaciones = !empty($_POST['observaciones']) ? $_POST['observaciones'] : '-';

                // Llamar a la función para agregar la entrada en la base de datos
                $result = AgregarEntrada($conn, $fecha, $producto, $cajas, $kilosBrutos, $piezasExtra, $destareAdd, $observaciones);

                // Procesar el resultado
                if (str_starts_with($result, "Operacion realizada")) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else {
                $data = ["error" => "Operacion fallida"];
            }
            
            break;

        case 'EditarEntrada':
            if(isset($_POST['id']) && isset($_POST['fecha']) && isset($_POST['producto'])){
                // Colocar los valores en las variables
                $id_entrada = $_POST['id'];
                $fecha = $_POST['fecha'];
                $producto = $_POST['producto'];
                $cajas = !empty($_POST['cajas']) ? $_POST['cajas'] : 0;
                $kilosBrutos = !empty($_POST['kilosBrutos']) ? $_POST['kilosBrutos'] : 0.0;
                $piezasExtra = !empty($_POST['piezasExtra']) ? $_POST['piezasExtra'] : 0;
                $destareAdd = !empty($_POST['destareAdd']) ? $_POST['destareAdd'] : 0.0;
                $observaciones = !empty($_POST['observaciones']) ? $_POST['observaciones'] : '-';

                // Llamar a la función para editar la entrada en la base de datos
                $result = EditarEntrada($conn, $id_entrada, $fecha, $producto, $cajas, $kilosBrutos, $piezasExtra, $destareAdd, $observaciones);

                // Procesar el resultado
                if (str_starts_with($result, "Operacion realizada")) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else {
                $data = ["error" => "Operacion fallida"];
            }

            break;

        case 'LeerEntradas':
            // colocar los valores de las variables
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Prosesar el resultado
            try {
                // Llamar a la función para leer las entradas en la base de datos
                $result = LeerEntradas($conn, $filters);

                // Procesar el resultado
                $data = $result;
            } catch(Exception $e){
                $data = ["error" => "Operacion fallida"];
            }

            break;

        case 'EliminarEntradas':
            if (isset($_POST['id'])){
                // Colocar los valores en variables
                $id_entrada = $_POST['id'];

                 // Llamar a la función para eliminar la entrada  en la base de datos
                $result = EliminarEntrada($conn, $id_entrada);

                // Procesar el resultado
                if (str_starts_with($result, "Operacion realizada")) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else{
                $data = ["error" => "Operacion fallida"];
            }

            break;

        case 'EstadoEntrada':
            if (isset($_POST['id']) && isset($_POST['estado'])){
                // Colocar los valores en las variables
                $id_entrada = $_POST['id'];
                $estado = $_POST['estado'];

                // Llamar a la función para modificar la entrada en la base de datos
                $result = EstadoEntrada($conn, $id_entrada, $estado);

                // Procesar el resultado
                if (str_starts_with($result, "Operacion realizada")) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else {
                $data = ["error" => "Operacion fallida"];
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