create database lembo_sgal_db;
USE lembo_sgal_db;


    
/*Insertar datos de prueba ⚡*/
INSERT INTO user (name,email) VALUES ('Santiago','Santiagosan1206@gmail,com'); 


DROP TABLE user;


CREATE TABLE users(	
    type_user ENUM('Administrador', 'Personal de Apoyo', 'Visitante'),
    type_ID ENUM('Cedula de Ciudadanía', 'Tarjeta de identidad', 'Cédula de extranjería',' PEP', 'Permiso Por Protección Temporal'),
    num_document_identity VARCHAR(12)  UNIQUE,
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_user VARCHAR(100) ,
    email VARCHAR(100) NOT NULL UNIQUE,
    cellphone VARCHAR(20),
	state_user ENUM("habilitado", "deshabilitado") default "habilitado",
    password varchar(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE crops (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_crop VARCHAR(255) NOT NULL,
	type_crop VARCHAR(100)  NOT NULL,
    location VARCHAR(100) NOT NULL,
    description_crop VARCHAR(20),
    size_m2 VARCHAR(255),
    image_crop TEXT,
    state_crop("habilitado", "deshabilitado") default "habilitado",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



CREATE TABLE cropcycle (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_cropCycle VARCHAR(255) NOT NULL,
    state_cycle ENUM("habilitado", "deshabilitado") default "habilitado" ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    period_cycle_start DATE NOT NULL,
    period_cycle_end DATE NOT NULL,
    description_cycle TEXT,
    news_cycle TEXT
);


CREATE TABLE consumables(	
	id INT AUTO_INCREMENT PRIMARY KEY,
	type_consumables TEXT NOT NULL,
    name_consumables VARCHAR(100) NOT NULL,
    quantity_consumables INT NOT NULL,
	unit_consumables VARCHAR(20) NOT NULL,
	unitary_value INT NOT NULL,
	total_value INT NOT NULL,
    description_consumables TEXT,
    state_consumables ENUM("habilitado", "deshabilitado") default "habilitado",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    
    
    
CREATE TABLE sensors(	
	id INT AUTO_INCREMENT PRIMARY KEY,
	type_sensor TEXT NOT NULL,
    name_sensor VARCHAR(100) NOT NULL,
	unit_sensor TEXT,
	time_sensor TEXT,
    description_sensor TEXT,
    image_sensor TEXT,
	state_sensor ENUM("habilitado", "deshabilitado") default "habilitado",
    quantity_sensor INT DEFAULT 0;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE cuadros_seleccionados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cuadro_id INT NOT NULL,
  usuario_id INT, -- opcional si usas autenticación
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE productions(	
    name_production VARCHAR(100) NOT NULL UNIQUE,
    responsable VARCHAR(50) NOT NULL,
    id VARCHAR(40) PRIMARY KEY,
    state_production ENUM("habilitado", "deshabilitado") default "habilitado",
	users_selected TEXT,
    crops_selected TEXT,
    name_cropCycle TEXT,
	name_consumables TEXT,
	quantity_consumables TEXT,
    unitary_value_consumables TEXT,
    total_value_consumables TEXT,
	name_sensor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );