# Prueba-Tecnica

Este repositorio está preparado con estructura **MVC** para la creación del proyecto Lembo SGAL, para la granja Lembo en Santa Rosa de Cabal. Permite gestionar usuarios, cultivos, ciclos, sensores, insumos y producciones
---

## 1️⃣ Nombre del Proyecto

# LemboProject

---

## 2️⃣ Descripción Breve

Aplicación RESTful para la creación, edición y consulta de usuarios, cultivos, ciclos, sensores, insumos , producciones, con autorización basada en JWT.

---

## 3️⃣ Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Bcrypt (para hashear contraseñas)
- Multer (para subir archivos)
- Morgan (Para ver respuestas en consola)
- CORS (Para solicitudes entre diferentes donminios)

---

## 4️⃣ Requisitos Previos

- Node.js >= v18
- MongoDB activo (local o en la nube)
- Variables de entorno (.env)

---

## 5️⃣ Instalación

```bash
git clone https://https://github.com/garbanzo12/LemboProject
cd lemboproject
npm install cors express mongoose morgan --save-dev nodemon multer bcrypts jsonwebtoken
