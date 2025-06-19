<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cargar el autoload de Composer
require __DIR__ . '/../vendor/autoload.php';

// Cargar las variables de entorno desde el archivo .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '/../assets/settings.env');
$dotenv->load();

// Importar la coneccion al servidor
require '../api/db.php';

// Crear conexion
$conn = Database::connect();

// verificar si no hubo errores de conexion
if ($conn->connect_error){
    die("Conexion fallida: " . $conn->connect_error);
}

// Declarar el metodo y la llave para encriptar
$ENCRYPT_METHOD = $_ENV['ENCRYPT_METHOD'];
$SECRET_KEY = $_ENV['SECRET_KEY'];

// ================================= FUNCIONES =================================

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
    return password_verify($userPassword, $storedHash);
}

function encriptar($texto) {
    $clave = hash('sha256', $SECRET_KEY, true);
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($ENCRYPT_METHOD));
    $texto_encriptado = openssl_encrypt($texto, $ENCRYPT_METHOD, $clave, 0, $iv);
    // Combina texto e IV para almacenarlo o transmitirlo
    return base64_encode($texto_encriptado . '::' . $iv);
}

function desencriptar($texto_encriptado_base64) {
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
        return "Correo electrónico no válido";
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
        return "Correo electrónico no válido";
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