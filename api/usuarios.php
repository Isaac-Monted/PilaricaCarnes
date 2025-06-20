<?php
// Cargar el autoload de Composer
require __DIR__ . '/../vendor/autoload.php';
// Importar la coneccion al servidor
require '../api/db.php';

// Activar el reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cargar las variables de entorno desde el archivo .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '/../assets/settings.env');
$dotenv->load();

// Crear conexion
$conn = Database::connect();

// verificar si no hubo errores de conexion
if ($conn->connect_error){
    die("Conexion fallida: " . $conn->connect_error);
}

// Declarar el metodo y la llave para encriptar
$ENCRYPT_METHOD = (string) $_ENV['ENCRYPT_METHOD'];
$SECRET_KEY = (string) $_ENV['SECRET_KEY'];
// ================================= FUNCIONES =================================

function crearCookieAcceso() {
    setcookie('acceso', 'true', [
        'path' => '/',
        //'secure' => true,       // Solo por HTTPS
        'httponly' => true,     // Inaccesible por JavaScript
        'samesite' => 'Strict'  // Previene CSRF
    ]);
}

function eliminarCookieAcceso() {
    // Elimina del navegador
    setcookie('acceso', '', [
        'path' => '/',
        //'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    // Elimina del entorno actual de PHP
    unset($_COOKIE['acceso']);
}

function hashPasswordBcrypt($password){
    // PASSWORD_DEFAULT es la constante recomendada para password_hash().
    // PHP automáticamente genera un "salt" seguro y lo incrusta en el hash resultante.
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    return $hashedPassword;
}

function verifyPassword($userPassword, $storedHash){
    // password_verify() es la forma segura y correcta de comparar
    // una contraseña en texto plano con un hash.
    // Maneja el salting y el algoritmo automáticamente.
    $confirmacion = password_verify($userPassword, $storedHash);
    if($confirmacion){
        crearCookieAcceso();
    }
    return $confirmacion;
}

function encriptar($texto) {
    global $SECRET_KEY, $ENCRYPT_METHOD;
    $clave = hash('sha256', $SECRET_KEY, true);
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($ENCRYPT_METHOD));
    $texto_encriptado = openssl_encrypt($texto, $ENCRYPT_METHOD, $clave, 0, $iv);
    // Combina texto e IV para almacenarlo o transmitirlo
    return base64_encode($texto_encriptado . '::' . $iv);
}

function desencriptar($texto_encriptado_base64) {
    global $SECRET_KEY, $ENCRYPT_METHOD;
    $clave = hash('sha256', $SECRET_KEY, true);
    $datos = base64_decode($texto_encriptado_base64);
    
    if (strpos($datos, '::') === false) {
        return false; // Formato incorrecto
    }

    list($texto_encriptado, $iv) = explode('::', $datos, 2);
    return openssl_decrypt($texto_encriptado, $ENCRYPT_METHOD, $clave, 0, $iv);
}

function AgregarUsuario($conn, $usuario, $nombre, $apellidoP, $apellidoM, $contrasena, $correo, $telefono, $estado='Activo') {
    if (empty($usuario) || empty($nombre) || empty($apellidoP)){
        return "Error: debes proporcionar los datos necesarios para agregar";
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        //return "Correo electrónico no válido";
        $correo = '-';
    }

    // Consulta SQL para insertar los datos en la base de datos
    $query = "INSERT IGNORE INTO usuarios (
        nombre,
        primer_apellido,
        segundo_apellido,
        usuario,
        contrasena,
        correo,
        telefono,
        estado) VALUES (?,?,?,?,?,?,?,?)
    ";

    // Preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        return "Error en la preparación de la consulta: " . $conn->error;
    }

    // cifrar datos sensibles
    $contrasena_cryp = hashPasswordBcrypt($contrasena);
    $correo_cryp = encriptar($correo);
    $telefono_cryp = encriptar($telefono);

    // Vinculamos los parametros
    $stmt->bind_param("ssssssss", $nombre, $apellidoP, $apellidoM, $usuario, $contrasena_cryp, $correo_cryp, $telefono_cryp, $estado);

    // Ejecutamos la consulta
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            return "Operacion realizada";
        } else {
            return "Usuario repetido";
        }
    } else {
        return "Error al agregar el usuario: " . $stmt->error;
    }

    $stmt->close();
}

function EditarUsuario($conn, $id_usuario, $usuario, $nombre, $apellidoP, $apellidoM, $contrasena, $correo, $telefono, $estado='Activo') {
    if (empty($id_usuario) || empty($usuario) || empty($nombre) || empty($apellidoP)){
        return "Error: debes proporcionar los datos necesarios para agregar";
    }

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        //return "Correo electrónico no válido";
        $correo = '-';
    }

    // Consulta SQL para editar los datos en la base de datos
    $query = "UPDATE usuarios SET
        nombre = ?,
        primer_apellido = ?,
        segundo_apellido = ?,
        usuario = ?,
        contrasena = ?,
        correo = ?,
        telefono = ?,
        estado = ?
    WHERE id = ?
    ";

    // preparacion de la consulta
    $stmt = $conn->prepare($query);
    if ($stmt === false){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // cifrar datos sensibles
    $contrasena_cryp = hashPasswordBcrypt($contrasena);
    $correo_cryp = encriptar($correo);
    $telefono_cryp = encriptar($telefono);

    // Vinculamos los parametros
    $stmt->bind_param("sssssssss", $nombre, $apellidoP, $apellidoM, $usuario, $contrasena_cryp, $correo_cryp, $telefono_cryp, $estado, $id_usuario);

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

function leerUsuarios($conn, $filters = []) {
    $query = "SELECT * FROM usuarios";
    $Params = [];
    $types = [];

    // Si hay filtros, constrimos el where
    if (!empty($filters)){
        $conditions = [];

        foreach ($filters as $field => $value){
            if ($field === 'nombre_usuario_buscar') {
                $conditions[] = "usuario LIKE ?";
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
    $query .= " ORDER BY usuario ASC";

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

function EliminarUsuario($conn, $id_usuario) {
    // Verificar que $id_usuario es un numero valido
    if (!is_numeric($id_usuario)){
        return "Error al eliminar la salida";
    }

    // Preparar la consulta SQL para eliminar el producto
    $query = "DELETE FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt){
        return "Error en la preparacion de la consulta: " . $conn->error;
    }

    // Vincular el parametro y ejecutar la consulta
    $stmt->bind_param("i", $id_usuario);

    if ($stmt->execute()){
        if ($stmt->affected_rows > 0){
            return "Operacion realizada";
        } else {
            return "Usuario no eliminada";
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
        case 'AgregarUsuario':
            if (isset($_POST['usuario']) && isset($_POST['nombre']) && isset($_POST['apellido_paterno'])){
                // Colocar los valores en variables
                $usuario = $_POST['usuario'];
                $nombre = $_POST['nombre'];
                $apellidoP = $_POST['apellido_paterno'];
                $apellidoM = !empty($_POST['apellido_materno']) ? $_POST['apellido_materno'] : '-';
                $contrasena = !empty($_POST['contrasena']) ? $_POST['contrasena'] : '1234';
                $correo = !empty($_POST['correo']) ? $_POST['correo'] : '-';
                $telefono = !empty($_POST['telefono']) ? $_POST['telefono'] : '-';
                $estado = !empty($_POST['estado']) ? $_POST['estado'] : 'Activo';

                // Llamar a la función para agregar el producto en la base de datos
                $result = AgregarUsuario($conn, $usuario, $nombre, $apellidoP, $apellidoM, $contrasena, $correo, $telefono, $estado);

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

        case 'EditarUsuario':
            if(isset($_POST['usuario']) && isset($_POST['nombre']) && isset($_POST['apellido_paterno']) && isset($_POST['id'])){
                // Colocar los valores en variables
                $id_usuario = $_POST['id'];
                $usuario = $_POST['usuario'];
                $nombre = $_POST['nombre'];
                $apellidoP = $_POST['apellido_paterno'];
                $apellidoM = !empty($_POST['apellido_materno']) ? $_POST['apellido_materno'] : '-';
                $contrasena = !empty($_POST['contrasena']) ? $_POST['contrasena'] : '1234';
                $correo = !empty($_POST['correo']) ? $_POST['correo'] : '-';
                $telefono = !empty($_POST['telefono']) ? $_POST['telefono'] : '-';
                $estado = !empty($_POST['estado']) ? $_POST['estado'] : 'Activo';
            
                // Llamar a la función para editar el usuario en la base de datos
                $result = EditarUsuario($conn, $id_usuario, $usuario, $nombre, $apellidoP, $apellidoM, $contrasena, $correo, $telefono, $estado);

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

        case 'LeerUsuarios':
            //colocar los valores de las variables
            $filters = isset($_GET['filters']) ? json_decode($_GET['filters'], true) : [];

            // Procesar el resultado
            try {
                // Llamar a la función para leer los usuarios en la base de datos
                $result = leerUsuarios($conn, $filters);
                $data = $result;
            } catch (Exception $e) {
                $data = ["error" => $e->getMessage()];
            }

            break;

        case 'EliminarUsuario':
            if (isset($_POST['id'])) {
                // Colocar los valores en variables
                $id_usuario = $_POST['id'];

                // Llamar a la función para eliminar el usuario en la base de datos
                $result = EliminarUsuario($conn, $id_usuario);

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

        case 'Desencriptar':
            if(isset($_GET['encriptado'])){
                // declarar la cadena de texto encriptada
                $encriptado = $_GET['encriptado'];

                // Procesar el resultado
                try {
                    // Llamar a la función para eliminar el usuario en la base de datos
                    $result = desencriptar($encriptado);
                    $data = $result;
                } catch (Exception $e) {
                    $data = ["error" => $e->getMessage()];
                }
            } else {
                $data = ["error" => "Operacion fallida"];
            }

            break;

        case 'Validacion':
            if (isset($_POST['escrita']) && isset($_POST['almacenada'])) {
                // Colocar los valores en variables
                $pass_escrita = $_POST['escrita'];
                $pass_almacenada = $_POST['almacenada'];

                // Llamar a la función para eliminar el usuario en la base de datos
                $result = verifyPassword($pass_escrita, $pass_almacenada);

                // Procesar el resultado
                if ($result) {
                    $data = ["success" => $result];
                } else {
                    $data = ["error" => $result];
                }
            } else{
                $data = ["error" => "Operacion fallida"];
            }

            break;

        case 'CerrarSesion':
            // Procesar el resultado
            try {
                // Llamar a la función para eliminar el usuario en la base de datos
                $result = eliminarCookieAcceso();
                $data = ["success" => 'Cerrado'];
            } catch (Exception $e) {
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