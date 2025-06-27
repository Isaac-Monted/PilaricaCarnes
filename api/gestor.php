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

function FiltarSalidas($conn, $filters = []) {
    $queryBase = "
        SELECT
            Carnes_salidas.id,
            Carnes_salidas.fecha_registro,
            Carnes_productos.nombre_producto,
            Carnes_salidas.producto_id,
            Carnes_salidas.cajas,
            Carnes_salidas.kilos_brutos,
            Carnes_salidas.piezas_extra,
            Carnes_salidas.destare_add,
            Carnes_salidas.total_piezas,
            Carnes_salidas.total_kilos,
            Carnes_salidas.observaciones,
            Carnes_salidas.fecha_modificacion,
            Carnes_salidas.fecha_creacion
            from Carnes_salidas
        INNER JOIN
            Carnes_productos
            ON Carnes_salidas.producto_id = Carnes_productos.id
    ";

    $queryAgrupacion = "
        SELECT
            MAX(Carnes_salidas.id) AS id,
            MAX(Carnes_salidas.fecha_registro) AS fecha_registro,
            MAX(Carnes_productos.nombre_producto) AS nombre_producto,
            Carnes_salidas.producto_id,
            SUM(Carnes_salidas.cajas) AS cajas,
            SUM(Carnes_salidas.kilos_brutos) AS kilos_brutos,
            SUM(Carnes_salidas.piezas_extra) AS piezas_extra,
            SUM(Carnes_salidas.destare_add) AS destare_add,
            SUM(Carnes_salidas.total_piezas) AS total_piezas,
            SUM(Carnes_salidas.total_kilos) AS total_kilos,
            MAX(Carnes_salidas.observaciones) AS observaciones,
            MAX(Carnes_salidas.fecha_modificacion) AS fecha_modificacion,
            MAX(Carnes_salidas.fecha_creacion) AS fecha_creacion
            from Carnes_salidas
        INNER JOIN
            Carnes_productos
            ON Carnes_salidas.producto_id = Carnes_productos.id
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
                $conditions[] = "Carnes_salidas.$field = ?";
                $Params[] = $value;
                $types[] = "s";
            }
            //AGRUPACION
            if ($field === "agrupacion") {
                if($value === 'true'){
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
            $conditions[] = "Carnes_salidas.fecha_registro BETWEEN ? AND ?";
            $Params[] = $fechas['inicio'];
            $Params[] = $fechas['termino'];
            $types[] = "s";
            $types[] = "s";
        } elseif (!empty($fechas['inicio'])) {
            $conditions[] = "Carnes_salidas.fecha_registro >= ?";
            $Params[] = $fechas['inicio'];
            $types[] = "s";
        } elseif (!empty($fechas['termino'])) {
            $conditions[] = "Carnes_salidas.fecha_registro <= ?";
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
        $query .= " GROUP BY Carnes_salidas." . $conn->real_escape_string($groupBy);
    }

    // Ordenamiento (ORDER BY)
    if (!empty($orderBy)) {
        $query .= " ORDER BY Carnes_salidas." . $conn->real_escape_string($orderBy) . " " . $orderDir;
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

function FiltarCambios($conn, $filters = []) {
    $queryBase = "
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

    $queryAgrupacion = "
        SELECT
            MAX(Carnes_cambios.id) AS id,
            MAX(Carnes_cambios.fecha_registro) AS fecha_registro,
            MAX(producto_Origen.nombre_producto) AS nombre_producto_origen,
            MAX(producto_Destino.nombre_producto) AS nombre_producto_destino,
            Carnes_cambios.producto_origen_id,
            MAX(Carnes_cambios.producto_destino_id) AS producto_destino_id,
            SUM(Carnes_cambios.cajas_origen) AS cajas_origen,
            SUM(Carnes_cambios.kilos_brutos_origen) AS kilos_brutos_origen,
            SUM(Carnes_cambios.piezas_extra_origen) AS piezas_extra_origen,
            SUM(Carnes_cambios.destare_add_origen) AS destare_add_origen,
            SUM(Carnes_cambios.total_piezas_origen) AS total_piezas_origen,
            SUM(Carnes_cambios.total_kilos_origen) AS total_kilos_origen,
            SUM(Carnes_cambios.cajas_destino) AS cajas_destino,
            SUM(Carnes_cambios.kilos_brutos_destino) AS kilos_brutos_destino,
            SUM(Carnes_cambios.piezas_extra_destino) AS piezas_extra_destino,
            SUM(Carnes_cambios.destare_add_destino) AS destare_add_destino,
            SUM(Carnes_cambios.total_piezas_destino) AS total_piezas_destino,
            SUM(Carnes_cambios.total_kilos_destino) AS total_kilos_destino,
            MAX(Carnes_cambios.observaciones) AS observaciones,
            MAX(Carnes_cambios.fecha_modificacion) AS fecha_modificacion,
            MAX(Carnes_cambios.fecha_creacion) AS fecha_creacio
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
            //PRODUCTO ORIGEN
            if($field === "producto_origen"){
                $conditions[] = "Carnes_cambios.producto_origen_id = ?";
                $Params[] = $value;
                $types[] = "i";
            }
            //PRODUCTO DESTINO
            if($field === "producto_destino"){
                $conditions[] = "Carnes_cambios.producto_destino_id = ?";
                $Params[] = $value;
                $types[] = "i";
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
                $conditions[] = "Carnes_cambios.$field = ?";
                $Params[] = $value;
                $types[] = "s";
            }
            //AGRUPACION
            if ($field === "agrupacion") {
                if($value === 'true'){
                    $usarAgrupacion = $value;
                    $groupBy = 'producto_origen_id'; // Colocar la columna de agrupacion
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
            $conditions[] = "Carnes_cambios.fecha_registro BETWEEN ? AND ?";
            $Params[] = $fechas['inicio'];
            $Params[] = $fechas['termino'];
            $types[] = "s";
            $types[] = "s";
        } elseif (!empty($fechas['inicio'])) {
            $conditions[] = "Carnes_cambios.fecha_registro >= ?";
            $Params[] = $fechas['inicio'];
            $types[] = "s";
        } elseif (!empty($fechas['termino'])) {
            $conditions[] = "Carnes_cambios.fecha_registro <= ?";
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
        $query .= " GROUP BY Carnes_cambios." . $conn->real_escape_string($groupBy);
    }

    // Ordenamiento (ORDER BY)
    if (!empty($orderBy)) {
        $query .= " ORDER BY Carnes_cambios." . $conn->real_escape_string($orderBy) . " " . $orderDir;
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

function CalcularInventario($conn, $filters = []) {
    $comentarios = [];

    // Definir valores por defecto
    $producto_id = null;
    $fecha = date("d-m-Y"); // Fecha por defecto: hoy

    // Verificar filtros
    if (!empty($filters)) {
        if (isset($filters['producto_id'])) {
            $producto_id = $filters['producto_id'];
        }
        if (isset($filters['fecha'])) {
            $fecha = $filters['fecha'];
        }
    }

    // Preparar la llamada al procedimiento almacenado con parámetros fijos
    $query = "CALL Carnes_existencia_inventario(?, ?)";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Bind de parámetros: (fecha STRING, producto_id INT o null)
    $stmt->bind_param("si", $fecha, $producto_id);

    // Ejecutar
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $comentarios[] = $row;
    }
    return $comentarios;
    $stmt->close();
}

// ================================= ENRUTAMIENTO =================================
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    // Definir un array para almacenar las respuestas
    $data = [];

    // Dependiendo de la acción solicitada, ejecutar la función correspondiente
    switch ($action) {
        case 'FiltarEntradas':
            // Llamar a la función para editar el correo en la base de datos
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Procesar el resultado
            try {
                // Llamar a la función para agregar la salida en la base de datos
                $result = FiltarEntradas($conn, $filters);

                // Procesar el resultado
                $data = $result;
            } catch(Exception $e){
                $data = ["error" => $e->getMessage()];
            }

            break;

        case 'FiltarSalidas':
            // Llamar a la función para editar el correo en la base de datos
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Procesar el resultado
            try {
                // Llamar a la función para agregar la salida en la base de datos
                $result = FiltarSalidas($conn, $filters);

                // Procesar el resultado
                $data = $result;
            } catch(Exception $e){
                $data = ["error" => $e->getMessage()];
            }

            break;

        case 'FiltarCambios':
            // Llamar a la función para editar el correo en la base de datos
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Procesar el resultado
            try {
                // Llamar a la función para agregar la salida en la base de datos
                $result = FiltarCambios($conn, $filters);

                // Procesar el resultado
                $data = $result;
            } catch(Exception $e){
                $data = ["error" => $e->getMessage()];
            }

            break;

        case 'CalcularInventario':
            // Llamar a la función para editar el correo en la base de datos
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Procesar el resultado
            try {
                // Llamar a la función para agregar la salida en la base de datos
                $result = CalcularInventario($conn, $filters);

                // Procesar el resultado
                $data = $result;
            } catch(Exception $e){
                $data = ["error" => $e->getMessage()];
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