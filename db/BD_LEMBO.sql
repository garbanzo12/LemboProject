create database lembo_sgal_db;
USE lembo_sgal_db;


    
/*Insertar datos de prueba ⚡*/
INSERT INTO user (name,email) VALUES ('Santiago','Santiagosan1206@gmail,com'); 


DROP TABLE user;


CREATE TABLE users(	
    type_user ENUM('Administrador', 'Personal de Apoyo', 'Visitante'),
    type_ID ENUM('Administrador', 'Personal de Apoyo', 'Visitante'),
	id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    rol VARCHAR(20),
    password VARCHAR(255) NOT NULL,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE cropCycle(	
	id INT AUTO_INCREMENT PRIMARY KEY,
    name_cropCycle VARCHAR(100) NOT NULL,
    news TEXT NOT NULL,
    size_cropCycle INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );



CREATE TABLE consumables(	
	id INT AUTO_INCREMENT PRIMARY KEY,
	type_consumables TEXT NOT NULL,
    name_consumables VARCHAR(100) NOT NULL,
    quantity_consumables INT NOT NULL,
	unit_consumables INT NOT NULL,
	unitary_value INT NOT NULL,
	total_value INT NOT NULL,
    description_consumables TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    
    
    
CREATE TABLE sensors(	
	id INT AUTO_INCREMENT PRIMARY KEY,
	type_sensors TEXT NOT NULL,
    name_sensors VARCHAR(100) NOT NULL,
	unit_sensors INT NOT NULL,
	time_sensors INT,
    description_consumables TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );