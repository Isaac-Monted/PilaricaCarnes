<?php
class DataBase{
    public static function connect(){
        // Cargar el autoload de Composer
        require __DIR__ . '/../vendor/autoload.php';

        // Cargar las variables de entorno desde el archivo .env
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '/../assets/settings.env');
        $dotenv->load();

        // Activar el reporte de errores para depuración
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        // Credenciales de la base de datos
        $servername = $_ENV['DB_HOST'];
        $username = $_ENV['DB_USER'];
        $password = $_ENV['DB_PASSWORD'];
        $dbname = $_ENV['DB_DATABASE'];
        $port = $_ENV['DB_PORT'];
            
        
        // Crear la conexión
        $conexion = new mysqli($servername, $username, $password, $dbname, $port);
        // Establecer la codificación de caracteres de la conexión a UTF-8
        $conexion->set_charset("utf8mb4");
        // Retornar la conexion
        return $conexion;
    }
}
?>