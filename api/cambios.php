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
    die("Conexion fallida: " . $conn->connect_error);
}

// ================================= FUNCIONES =================================
function AgregarCambio($conn, $fecha, $id_producto_origen, $id_producto_destino, $cajas_origen, $kilos_brutos_origen, $piezas_extra_origen, $destare_add_origen, $cajas_destino, $kilos_brutos_destino, $piezas_extra_destino, $destare_add_destino, $observaciones) {
    if (empty($fecha) || empty($id_producto_origen) || empty($id_producto_destino)){
        return "Error: debes de proporcionar los datos nececarios para agregar";
    }

    // Consulta SQL para insertar los datos en la base de datos
    $query = " INSERT IGNORE INTO Carnes_cambios (
    fecha_registro,
    producto_origen_id,
    producto_destino_id,
    cajas_origen,
    kilos_brutos_origen,
    piezas_extra_origen,
    destare_add_origen,
    cajas_destino,
    kilos_brutos_destino,
    piezas_extra_destino,
    destare_add_destino,
    observaciones) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ";
    
    // Preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vinculamos los parametros
    $stmt->bind_param("siiidididids", $fecha, $id_producto_origen, $id_producto_destino, $cajas_origen, $kilos_brutos_origen, $piezas_extra_origen, $destare_add_origen, $cajas_destino, $kilos_brutos_destino, $piezas_extra_destino, $destare_add_destino, $observaciones);

    // ejecutamos la consulta
    if ($stmt->execute()){
        if ($stmt->affected_rows > 0){
            return "Operacion realizada";
        } else {
            return "Error de escritura";
        }
    } else {
        return "Error al agregar la salida" . $stmt->error;
    }

    $stmt->close();
}

function EditarCambio($conn, $id_cambio, $fecha, $id_producto_origen, $id_producto_destino, $cajas_origen, $kilos_brutos_origen, $piezas_extra_origen, $destare_add_origen, $cajas_destino, $kilos_brutos_destino, $piezas_extra_destino, $destare_add_destino, $observaciones) {
    if (empty($id_cambio) || empty($fecha) || empty($id_producto_origen) || empty($id_producto_destino)){
        return "Error: debes proporcionar los datos necesarios para editar";
    }

    // Consulta SQL para editar los datos en la base de datos
    $query = "UPDATE Carnes_cambios SET
        fecha_registro = ?,
        producto_origen_id = ?,
        producto_destino_id = ?,
        cajas_origen = ?,
        Kilos_brutos_origen = ?,
        piezas_extra_origen = ?,
        destare_add_origen = ?,
        cajas_destino = ?,
        kilos_brutos_destino = ?,
        piezas_extra_destino = ?,
        destare_add_destino = ?,
        observaciones = ?
    WHERE id = ?
    ";

    // preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vinculamos los parametros
    $stmt->bind_param("siiididididsi", $fecha, $id_producto_origen, $id_producto_destino, $cajas_origen, $kilos_brutos_origen, $piezas_extra_origen, $destare_add_origen, $cajas_destino, $kilos_brutos_destino, $piezas_extra_destino, $destare_add_destino, $observaciones, $id_cambio);

    //ejecutamos la consulta
    if ($stmt->execute()){
        if ($stmt->affected_rows > 0){
            return "Operacion realizada";
        } else {
            return "error de escritura";
        }
    } else {
        return "Error al editar la salida: " . $stmt->error;
    }

    $stmt->close();
}

function LeerCambios($conn, $filters = []) {
    $query ="
        SELECT
            Carnes_cambios.id,
            Carnes_cambios.fecha_registro,
            producto_Origen.nombre_producto AS nombre_producto_origen,
            producto_Destino.nombre_producto AS nombre_producto_destino,
            Carnes_cambios.producto_origen_id,
            Carnes_cambios.producto_destino_id,
            Carnes_cambios.cajas_origen,
            Carnes_cambios.kilos_brutos_origen,
            Carnes_cambios.piezas_extra_origen,
            Carnes_cambios.destare_add_origen,
            Carnes_cambios.total_piezas_origen,
            Carnes_cambios.total_kilos_origen,
            Carnes_cambios.cajas_destino,
            Carnes_cambios.kilos_brutos_destino,
            Carnes_cambios.piezas_extra_destino,
            Carnes_cambios.destare_add_destino,
            Carnes_cambios.total_piezas_destino,
            Carnes_cambios.total_kilos_destino,
            Carnes_cambios.observaciones,
            Carnes_cambios.fecha_modificacion,
            Carnes_cambios.fecha_creacion
            from Carnes_cambios
        INNER JOIN
            Carnes_productos AS producto_Origen
            ON Carnes_cambios.producto_origen_id = producto_Origen.id
        INNER JOIN
            Carnes_productos AS producto_Destino
            ON Carnes_cambios.producto_destino_id = producto_Destino.id
    ";
    $Params = [];
    $types = [];

    // si hay filtros constuimos el where
    if (!empty($filters)){
        $conditions = [];

        foreach ($filters as $field => $value){
            if ($field === 'nombre_producto_origen_buscar') {
                $conditions[] = "producto_origen_id LIKE ?";
                $Params[] = "%" . $value . "%"; // añadir los comodines aqui
                $types[] = "s";
            } elseif ($field === 'nombre_producto_destino_buscar') {
                $conditions[] = "producto_destino_id LIKE ?";
                $Params[] = "%" . $value . "%"; // añadir los comodines aqui
                $types[] = "s";
            } else {
                if($field === "nombre_producto_origen" || $field === "nombre_producto_destino"){
                    $conditions[] = "Carnes_productos.$field = ?";
                }else{
                    $conditions[] = "Carnes_cambios.$field = ?";
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
    $query .= " ORDER BY id ASC";

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

function EliminarCambio($conn, $id_cambio) {
    // Verificar que $id_cambio es un numero valido
    if (!is_numeric($id_cambio)){
        return "Error al eliminar el cambio";
    }

    // Preparar la consulta SQL para eliminar el producto
    $query = "DELETE FROM Carnes_cambios WHERE id= ?";
    $stmt =  $conn->prepare($query);

    if (!$stmt){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vincular el parametro y ejecutar la consulta
    $stmt->bind_param("i", $id_cambio);

    if($stmt->execute()){
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

// ================================= ENRUTAMIENTO =================================
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    // Definir un array para almacenar las respuestas
    $data = [];

    // Dependiendo de la acción solicitada, ejecutar la función correspondiente
    switch ($action) {
        case 'AgregarCambio':
            if (isset($_POST['fecha']) && isset($_POST['producto_origen']) && isset($_POST['producto_destino'])){
                // Colocar los valores en las variables
                $fecha = $_POST['fecha'];
                $producto_origen = $_POST['producto_origen'];
                $producto_destino = $_POST['producto_destino'];
                $cajas_origen = !empty($_POST['cajas_origen']) ? $_POST['cajas_origen'] : 0;
                $kilosBrutos_origen = !empty($_POST['kilosBrutos_origen']) ? $_POST['kilosBrutos_origen'] : 0.0;
                $piezasExtra_origen = !empty($_POST['piezasExtra_origen']) ? $_POST['piezasExtra_origen'] : 0;
                $destareAdd_origen = !empty($_POST['destareAdd_origen']) ? $_POST['destareAdd_origen'] : 0.0;
                $cajas_destino = !empty($_POST['cajas_destino']) ? $_POST['cajas_destino'] : 0;
                $kilosBrutos_destino = !empty($_POST['kilosBrutos_destino']) ? $_POST['kilosBrutos_destino'] : 0.0;
                $piezasExtra_destino = !empty($_POST['piezasExtra_destino']) ? $_POST['piezasExtra_destino'] : 0;
                $destareAdd_destino = !empty($_POST['destareAdd_destino']) ? $_POST['destareAdd_destino'] : 0.0;
                $observaciones = !empty($_POST['observaciones']) ?? '-';

                // Llamar a la función para agregar la cambio en la base de datos
                $result = AgregarCambio($conn, $fecha, $producto_origen, $producto_destino, $cajas_origen, $kilosBrutos_origen, $piezasExtra_origen, $destareAdd_origen, $cajas_destino, $kilosBrutos_destino, $piezasExtra_destino, $destareAdd_destino, $observaciones);

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

        case 'EditarCambio':
            if (isset($_POST['id']) && isset($_POST['fecha']) && isset($_POST['producto_origen']) && isset($_POST['producto_destino'])){
                // Colocar los valores en las variables
                $id_cambio = $_POST['id'];
                $fecha = $_POST['fecha'];
                $producto_origen = $_POST['producto_origen'];
                $producto_destino = $_POST['producto_destino'];
                $cajas_origen = !empty($_POST['cajas_origen']) ? $_POST['cajas_origen'] : 0;
                $kilosBrutos_origen = !empty($_POST['kilosBrutos_origen']) ? $_POST['kilosBrutos_origen'] : 0.0;
                $piezasExtra_origen = !empty($_POST['piezasExtra_origen']) ? $_POST['piezasExtra_origen'] : 0;
                $destareAdd_origen = !empty($_POST['destareAdd_origen']) ? $_POST['destareAdd_origen'] : 0.0;
                $cajas_destino = !empty($_POST['cajas_destino']) ? $_POST['cajas_destino'] : 0;
                $kilosBrutos_destino = !empty($_POST['kilosBrutos_destino']) ? $_POST['kilosBrutos_destino'] : 0.0;
                $piezasExtra_destino = !empty($_POST['piezasExtra_destino']) ? $_POST['piezasExtra_destino'] : 0;
                $destareAdd_destino = !empty($_POST['destareAdd_destino']) ? $_POST['destareAdd_destino'] : 0.0;
                $observaciones = !empty($_POST['observaciones']) ?? '-';

                // Llamar a la función para agregar la cambio en la base de datos
                $result = EditarCambio($conn, $id_cambio, $fecha, $producto_origen, $producto_destino, $cajas_origen, $kilosBrutos_origen, $piezasExtra_origen, $destareAdd_origen, $cajas_destino, $kilosBrutos_destino, $piezasExtra_destino, $destareAdd_destino, $observaciones);

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

        case 'LeerCambios':
            // Colocar los valores en las variables
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Procesar el resultado
            try {
                // Llamar a la función para agregar la cambio en la base de datos
                $result = LeerCambios($conn, $filters);

                // Procesar el resultado
            $data = $result;
            } catch(Exception $e){
                $data = ["error" => $e->getMessage()];
            }

            break;

        case 'EliminarCambio':
            if (isset($_POST['id'])){
                // Colocar los valores en las variables
                $id_cambio = $_POST['id'];

                // Llamar a la función para agregar la cambio en la base de datos
                $result = EliminarCambio($conn, $id_cambio);

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