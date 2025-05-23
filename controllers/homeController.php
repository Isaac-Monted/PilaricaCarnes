
<?php
class HomeController {
    public static function index() {
        // Cargar la vista
        require_once __DIR__ . '/../views/home/index.php';
    }
}
?>