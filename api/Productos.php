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
function AgregarProducto($conn, $producto, $descripcion, $clave, $presentacion, $pesoXpz, $piezaXcj, $precio, $pzIniciales, $kgIniciales, $estado) {
    if (empty($producto)){
        return "Error: debes proporcionar un producto para agregar";
    }

    // Consulta SQL para insertar los datos en la base de datos
    $query = "INSERT IGNORE INTO Carnes_productos (
        nombre_producto,
        descripcion,
        clave,
        presentacion,
        peso_x_pieza,
        piezas_x_caja,
        precio,
        piezas_iniciales,
        kilos_iniciales,
        estado) VALUES (?,?,?,?,?,?,?,?,?,?)
    ";

    // Preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        return "Error en la preparación de la consulta: " . $conn->error;
    }

    // Vinculamos los parametros
    $stmt->bind_param("ssssdidids", $producto, $descripcion, $clave, $presentacion, $pesoXpz, $piezaXcj, $precio, $pzIniciales, $kgIniciales, $estado);

    // Ejecutamos la consulta
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            return "Operacion realizada";
        } else {
            return "Producto repetido";
        }
    } else {
        return "Error al suscribir el correo: " . $stmt->error;
    }

    $stmt->close();
}

function EditarProducto($conn, $id_producto, $producto, $descripcion, $clave, $presentacion, $pesoXpz, $piezaXcj, $precio, $pzIniciales, $kgIniciales, $estado='Activo') {
    if (empty($producto)){
        return "Error: debes proporcionar un producto para agregar";
    }

    // Consulta SQL para insertar los datos en la base de datos
    $query = "UPDATE Carnes_productos SET
        nombre_producto = ?,
        descripcion = ?,
        clave = ?,
        presentacion = ?,
        peso_x_pieza = ?,
        piezas_x_caja = ?,
        precio = ?,
        piezas_iniciales = ?,
        kilos_iniciales = ?,
        estado = ?
    WHERE id = ?
    ";

    // Preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        return "Error en la preparación de la consulta: " . $conn->error;
    }

    // Vinculamos los parametros
    $stmt->bind_param("ssssdididsi", $producto, $descripcion, $clave, $presentacion, $pesoXpz, $piezaXcj, $precio, $pzIniciales, $kgIniciales, $estado, $id_producto);

    // Ejecutamos la consulta
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            return "Operacion realizada";
        } else {
            return "Producto repetido";
        }
    } else {
        return "Error al editar el producto: " . $stmt->error;
    }

    $stmt->close();
}

function leerProductos($conn, $filters = []) {
    $query = "SELECT * FROM Carnes_productos";
    $Params = [];
    $types = [];

    // Si hay filtros, constrimos el where
    if (!empty($filters)){
        $conditions = [];

        foreach ($filters as $field => $value){
            if ($field === 'nombre_producto_buscar') {
                $conditions[] = "nombre_producto LIKE ?";
                $Params[] = "%" . $value . "%"; // Añadir los comodines aquí
                $types[] = "s";
            } else {
                $conditions[] = "$field = ?";
                $Params[] = $value;

                // Determinar tipo para bind_param
                if(is_int($value)){
                    $types[] = "i";
                }elseif(is_double($value)){
                    $types[] = "d";
                }else{
                    $types[] = "s"; // String por defecto
                }
            }
        }
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    $query .= " ORDER BY nombre_producto ASC";

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        return "Error en la preparación de la consulta: " . $conn->error;
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

function EliminarProducto($conn, $id_producto) {
    // verificar que $is_producto es un numero valido
    if (!is_numeric($id_producto)){
        return "Error al eliminar el producto";
    }

    // Preparar la cosulta SQL para eliminar el producto
    $query = "DELETE FROM Carnes_productos WHERE id = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        return "Error en la preparación de la consulta: " . $conn->error;
    }

    // vincular el parametro y ejecutar la consulta
    $stmt->bind_param("i", $id_producto);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            return "Operacion realizada";
        } else {
            return "Producto no eliminado";
        }
    } else {
        return "Error al ejecutar la operación: " . $stmt->error;

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
        case 'AgregarProducto':
            if (isset($_POST['producto'])){
                // Colocar los valores en variables
                $producto = $_POST['producto'];
                $descripcion = $_POST['descripcion'] ?? '-';
                $clave = $_POST['clave'] ?? '-';
                $presentacion = $_POST['presentacion'] ?? 'Pieza';
                $pesoXpz = $_POST['pesoXpieza'] ?? 0.0;
                $piezaXcj = $_POST['piezaXcaja'] ?? 0;
                $precio = $_POST['precio'] ?? 0.0;
                $pzIniciales = $_POST['piezasIniciales'] ?? 0;
                $kgIniciales = $_POST['kilosIniciales'] ?? 0.0;
                $estado = $_POST['estado'] ?? 'Activo';

                // Llamar a la función para editar el producto en la base de datos
                $result = AgregarProducto($conn, $producto, $descripcion, $clave, $presentacion, $pesoXpz, $piezaXcj, $precio, $pzIniciales, $kgIniciales, $estado);

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

        case 'EditarProducto':
            if(isset($_POST['producto'])){
                // Colocar los valores en variables
                $id_producto = $_POST['id'];
                $producto = $_POST['producto'];
                $descripcion = $_POST['descripcion'] ?? '-';
                $clave = $_POST['clave'] ?? '-';
                $presentacion = $_POST['presentacion'] ?? 'Pieza';
                $pesoXpz = $_POST['pesoXpieza'] ?? 0.0;
                $piezaXcj = $_POST['piezaXcaja'] ?? 0;
                $precio = $_POST['precio'] ?? 0.0;
                $pzIniciales = $_POST['piezasIniciales'] ?? 0;
                $kgIniciales = $_POST['kilosIniciales'] ?? 0.0;
                $estado = $_POST['estado'] ?? 'Activo';
            
                // Llamar a la función para editar el correo en la base de datos
                $result = EditarProducto($conn, $id_producto, $producto, $descripcion, $clave, $presentacion, $pesoXpz, $piezaXcj, $precio, $pzIniciales, $kgIniciales, $estado);

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

        case 'LeerProductos':
            //colocar los valores de las variables
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Procesar el resultado
            try {
                // Llamar a la función para editar el correo en la base de datos
                $result = leerProductos($conn, $filters);
                $data = $result;
            } catch (Exception $e) {
                $data = ["error" => $e->getMessage()];
            }

            break;

        case 'EliminarProducto':
            if (isset($_POST['id'])) {
                // Colocar los valores en variables
                $id_producto = $_POST['id'];

                // Llamar a la función para editar el correo en la base de datos
                $result = EliminarProducto($conn, $id_producto);

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