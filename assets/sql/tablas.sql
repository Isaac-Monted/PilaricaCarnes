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
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    DECLARE piezas INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

CREATE TRIGGER trg_entrada_before_update
BEFORE UPDATE ON Carnes_entradas
FOR EACH ROW
BEGIN
    DECLARE piezas INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

DELIMITER ;

create table if not exists Carnes_salidas(
	id INT PRIMARY KEY AUTO_INCREMENT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    DECLARE piezas INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

CREATE TRIGGER trg_salida_before_update
BEFORE UPDATE ON Carnes_salidas
FOR EACH ROW
BEGIN
    DECLARE piezas INT DEFAULT 0;

    SELECT piezas_x_caja INTO piezas
    FROM Carnes_productos
    WHERE id = NEW.producto_id;

    SET NEW.total_piezas = (piezas * NEW.cajas + NEW.piezas_extra);
    SET NEW.total_kilos = (NEW.kilos_brutos - (NEW.cajas * 2.4) - NEW.destare_add);
END$$

DELIMITER ;

create table if not exists Carnes_cambios(
	id INT PRIMARY KEY AUTO_INCREMENT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    correo TEXT DEFAULT '-',
    telefono  TEXT DEFAULT '-',

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

delimiter $$
create procedure Carnes_existencia_inventario (
	in fecha date,
    in producto_id int
)
begin
	select 
		productos.id,
		productos.nombre_producto,
		productos.descripcion,
		productos.clave,
		productos.piezas_iniciales,
		productos.kilos_iniciales,
		coalesce(entradas.total_piezas, 0) as total_piezas_entradas,
		coalesce(entradas.total_kilos, 0) as total_kilos_entradas,
		coalesce(salidas.total_piezas, 0) as total_piezas_salidas,
		coalesce(salidas.total_kilos, 0) as total_kilos_salidas,
		coalesce(cambiosS.total_piezas_salida, 0) as total_piezas_cambios_salidas,
		coalesce(cambiosS.total_kilos_salida, 0) as total_kilos_cambios_salidas,
		coalesce(cambiosE.total_piezas_entrada, 0) as total_piezas_cambios_entradas,
		coalesce(cambiosE.total_kilos_entrada, 0) as total_kilos_cambios_entradas,
		
		coalesce(productos.piezas_iniciales, 0)
	  + coalesce(entradas.total_piezas, 0)
	  - coalesce(cambiosS.total_piezas_salida, 0)
	  - coalesce(salidas.total_piezas, 0)
	  + coalesce(cambiosE.total_piezas_entrada, 0)
	  as piezas_actuales,

	coalesce(productos.kilos_iniciales, 0)
	  + coalesce(entradas.total_kilos, 0)
	  - coalesce(cambiosS.total_kilos_salida, 0)
	  - coalesce(salidas.total_kilos, 0)
	  + coalesce(cambiosE.total_kilos_entrada, 0)
	  as kilos_actuales
	from Carnes_productos  productos

	left join (
		select 
			entradas.producto_id,
			sum(entradas.total_piezas) as total_piezas,
			sum(entradas.total_kilos) as total_kilos
		from Carnes_entradas as entradas
		where (entradas.fecha_registro = fecha or fecha is null)
			and entradas.estado = 'activo'
		group by 
			entradas.producto_id
	) as entradas on entradas.producto_id = productos.id

	left join (
		select 
			salidas.producto_id,
			sum(salidas.total_piezas) as total_piezas,
			sum(salidas.total_kilos) as total_kilos
		from Carnes_salidas as salidas
		where (salidas.fecha_registro <= fecha or fecha is null) 
			and salidas.estado = 'activo'
		group by 
			salidas.producto_id
	) as salidas on salidas.producto_id = productos.id

	left join (
		select 
			cambios.producto_origen_id,
			sum(cambios.total_piezas_origen) as total_piezas_salida,
			sum(cambios.total_kilos_origen) as total_kilos_salida
		from Carnes_cambios as cambios
		where (cambios.fecha_registro <= fecha or fecha is null) 
			and cambios.estado = 'activo'
		group by 
			cambios.producto_origen_id
	) as cambiosS on cambiosS.producto_origen_id = productos.id

	left join (
		select 
			cambios.producto_destino_id,
			sum(cambios.total_piezas_destino) as total_piezas_entrada,
			sum(cambios.total_kilos_destino) as total_kilos_entrada
		from Carnes_cambios as cambios
		where (cambios.fecha_registro <= fecha or fecha is null) 
			and cambios.estado = 'activo'
		group by 
			cambios.producto_destino_id
	) as cambiosE on cambiosE.producto_destino_id = productos.id
    where (productos.id = producto_id or producto_id is null)
	order by
	productos.id;
end $$
delimiter ;