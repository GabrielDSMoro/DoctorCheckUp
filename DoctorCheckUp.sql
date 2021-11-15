CREATE DATABASE DoctorCheckUp;
USE DoctorCheckUp;
SET GLOBAL time_zone = '-3:00';


CREATE TABLE `tbmaquinas` (
   `Id_Maquina` smallint NOT NULL AUTO_INCREMENT,
   `status` varchar(30) NOT NULL,
   `Id_Filial` INTEGER,
   PRIMARY KEY (`Id_Maquina`)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
 CREATE TABLE `tbtanques` (
   `Id_Tanques` smallint NOT NULL AUTO_INCREMENT,
   `tipo` varchar(80) DEFAULT NULL,
   `capacidade` varchar(15) DEFAULT NULL,
   `temperatura` varchar(30) DEFAULT NULL,
   `status` varchar(30) DEFAULT NULL,
   PRIMARY KEY (`Id_Tanques`)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
 CREATE TABLE `tbsensores` (
   `Id_Sensor` smallint NOT NULL AUTO_INCREMENT,
   `Id_Maquina` smallint NOT NULL,
   PRIMARY KEY (`Id_Sensor`,`Id_Maquina`),
   KEY `Id_Sensor` (`Id_Sensor`),
   KEY `Id_Maquina` (`Id_Maquina`),
   CONSTRAINT `tbsensores_ibfk_1` FOREIGN KEY (`Id_Maquina`) REFERENCES `tbmaquinas` (`Id_Maquina`) ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
 CREATE TABLE `tbtestes` (
   `Id_Teste` smallint NOT NULL AUTO_INCREMENT,
   `dataTeste` varchar(60),
   `Id_Sensor` smallint NOT NULL,
   `Id_Maquina` smallint NOT NULL,
   `resultado` text DEFAULT NULL,
   PRIMARY KEY (`Id_Teste`),
   KEY `Id_Sensor` (`Id_Sensor`),
	KEY `Id_Maquina` (`Id_Maquina`),
   CONSTRAINT `tbtestes_ibfk_1` FOREIGN KEY (`Id_Sensor`) REFERENCES `tbsensores` (`Id_Sensor`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `tbtestes_ibfk_2` FOREIGN KEY (`Id_Maquina`) REFERENCES `tbmaquinas` (`Id_Maquina`) ON DELETE CASCADE ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
SHOW CREATE TABLE tbmaquinas;
SHOW CREATE TABLE tbtestes;
SHOW CREATE TABLE tbtanques;
SHOW CREATE TABLE tbsensores;