use fvyvvdbc_carnes;

create table if not exists Carnes_productos(
	id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(50) NOT NULL,
    descripcion TEXT DEFAULT '-',
    clave VARCHAR(20) DEFAULT '-',
    presentacion ENUM('Piezas', 'Kilos', 'Litros', 'Caja') DEFAULT 'Piezas',
    peso_x_pieza DECIMAL(10,2) DEFAULT 0.0,
    piezas_x_caja INT DEFAULT 0,
    precio DECIMAL(10,2) DEFAULT 0.0,
    piezas_iniciales INT DEFAULT 0,
    kilos_iniciales DECIMAL(10,2) DEFAULT 0.0,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table if not exists Carnes_entradas(
	id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    cajas INT DEFAULT 0,
    kilos_brutos DECIMAL(10,2) DEFAULT 0.0,
    piezas_extra INT DEFAULT 0,
    destare_add DECIMAL(10,2) DEFAULT 0.0,
    total_piezas INT DEFAULT 0,
    total_kilos DECIMAL(10,2) DEFAULT 0.0,
    observaciones TEXT DEFAULT '-',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES Carnes_productos(id)
);

DELIMITER $$

CREATE TRIGGER trg_entrada_before_insert
BEFORE INSERT ON Carnes_entradas
FOR EACH ROW
BEGIN
    DECLARE piezas_x_caja INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas_x_caja
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas_x_caja * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

CREATE TRIGGER trg_entrada_before_update
BEFORE UPDATE ON Carnes_entradas
FOR EACH ROW
BEGIN
    DECLARE piezas_x_caja INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas_x_caja
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas_x_caja * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

DELIMITER ;

create table if not exists Carnes_salidas(
	id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    cajas INT DEFAULT 0,
    kilos_brutos DECIMAL(10,2) DEFAULT 0.0,
    piezas_extra INT DEFAULT 0,
    destare_add DECIMAL(10,2) DEFAULT 0.0,
    total_piezas INT DEFAULT 0,
    total_kilos DECIMAL(10,2) DEFAULT 0.0,
    observaciones TEXT DEFAULT '-',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_id) REFERENCES Carnes_productos(id)
);

DELIMITER $$

CREATE TRIGGER trg_salida_before_insert
BEFORE INSERT ON Carnes_salidas
FOR EACH ROW
BEGIN
    DECLARE piezas_x_caja INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas_x_caja
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas_x_caja * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

CREATE TRIGGER trg_salida_before_update
BEFORE UPDATE ON Carnes_salidas
FOR EACH ROW
BEGIN
    DECLARE piezas_x_caja INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas_x_caja
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas_x_caja * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

DELIMITER ;

create table if not exists Carnes_cambios(
	id INT PRIMARY KEY AUTO_INCREMENT,
    producto_origen_id INT NOT NULL,
    producto_destino_id INT NOT NULL,
    cajas_origen INT DEFAULT 0,
    kilos_brutos_origen DECIMAL(10,2) DEFAULT 0.0,
    piezas_extra_origen INT DEFAULT 0,
    destare_add_origen DECIMAL(10,2) DEFAULT 0.0,
    total_piezas_origen INT DEFAULT 0,
    total_kilos_origen DECIMAL(10,2) DEFAULT 0.0,
    cajas_destino INT DEFAULT 0,
    kilos_brutos_destino DECIMAL(10,2) DEFAULT 0.0,
    piezas_extra_destino INT DEFAULT 0,
    destare_add_destino DECIMAL(10,2) DEFAULT 0.0,
    total_piezas_destino INT DEFAULT 0,
    total_kilos_destino DECIMAL(10,2) DEFAULT 0.0,
    observaciones TEXT DEFAULT '-',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_creacion  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (producto_origen_id) REFERENCES Carnes_productos(id),
    FOREIGN KEY (producto_destino_id) REFERENCES Carnes_productos(id)
);

DELIMITER $$

CREATE TRIGGER trg_cambio_before_insert
BEFORE INSERT ON Carnes_cambios
FOR EACH ROW
BEGIN
    DECLARE piezas_origen INT DEFAULT 0;
    DECLARE piezas_destino INT DEFAULT 0;

    -- Obtener piezas por caja para producto origen
    SELECT piezas_x_caja INTO piezas_origen
    FROM Carnes_productos
    WHERE id = NEW.producto_origen_id;

    -- Obtener piezas por caja para producto destino
    SELECT piezas_x_caja INTO piezas_destino
    FROM Carnes_productos
    WHERE id = NEW.producto_destino_id;

    -- Calcular totales origen
    SET NEW.total_piezas_origen = (piezas_origen * NEW.cajas_origen + NEW.piezas_extra_origen);
    SET NEW.total_kilos_origen = (NEW.kilos_brutos_origen - (NEW.cajas_origen * 2.4) - NEW.destare_add_origen);

    -- Calcular totales destino
    SET NEW.total_piezas_destino = (piezas_destino * NEW.cajas_destino + NEW.piezas_extra_destino);
    SET NEW.total_kilos_destino = (NEW.kilos_brutos_destino - (NEW.cajas_destino * 2.4) - NEW.destare_add_destino);
END$$

CREATE TRIGGER trg_cambio_before_update
BEFORE UPDATE ON Carnes_cambios
FOR EACH ROW
BEGIN
    DECLARE piezas_origen INT DEFAULT 0;
    DECLARE piezas_destino INT DEFAULT 0;

    -- Obtener piezas por caja para producto origen
    SELECT piezas_x_caja INTO piezas_origen
    FROM Carnes_productos
    WHERE id = NEW.producto_origen_id;

    -- Obtener piezas por caja para producto destino
    SELECT piezas_x_caja INTO piezas_destino
    FROM Carnes_productos
    WHERE id = NEW.producto_destino_id;

    -- Calcular totales origen
    SET NEW.total_piezas_origen = (piezas_origen * NEW.cajas_origen + NEW.piezas_extra_origen);
    SET NEW.total_kilos_origen = (NEW.kilos_brutos_origen - (NEW.cajas_origen * 2.4) - NEW.destare_add_origen);

    -- Calcular totales destino
    SET NEW.total_piezas_destino = (piezas_destino * NEW.cajas_destino + NEW.piezas_extra_destino);
    SET NEW.total_kilos_destino = (NEW.kilos_brutos_destino - (NEW.cajas_destino * 2.4) - NEW.destare_add_destino);
END$$

DELIMITER ;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    primer_apellido VARCHAR(50) NOT NULL,
    segundo_apellido VARCHAR(50) DEFAULT '-',
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    correo VARCHAR(100) DEFAULT '-',
    telefono  VARCHAR(20) DEFAULT '-',

    rol_id INT NOT NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT DEFAULT '-',

    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);