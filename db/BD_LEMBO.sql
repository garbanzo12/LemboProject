create database lembo_sgal_db;
USE lembo_sgal_db;


    
/*Insertar datos de prueba ⚡*/
INSERT INTO user (name,email) VALUES ('Santiago','Santiagosan1206@gmail,com'); 


DROP TABLE user;


CREATE TABLE users(	
	id INT AUTO_INCREMENT PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    rol VARCHAR(20),
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