require('dotenv').config(); //Esta es la forma para llamar una variable de entorno
//⬆ Para que el dotenv funcionehay que instalar por medio de npm install dotenv
const express = require('express');
const mysql = require('mysql2');
//CORS(Comparticion entre origenes cruzados)
//Para proteger la seguridad del usuario
const cors = require('cors');

const PORT = process.env.PORT //Aqui se creo una variable donde se almaceno la variable del puerto

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'lembo_sga_db',
    port : PORT // Aqui se esta usando la variable de env en routes
});


db.connect(err => {
    if(err){
        console.log(`Error conectando la DB: ${err}`);
        return;
    }
    console.log(`Conectando con la DB - Full`);
});



app.post('/user', (req, res) => {
    const {name, email, address, phone} = req.body;

    db.query(
        'INSERT INTO user (name, email, addres, phone) VALUES (?, ?, ?, ?)',
        [name, email, address, phone],
        (err, result) => {
            if (err){
                console.log(`Error insertando usuario: ${err}`);
                res.status(500).json({error : 'Error al registrar al usuario'});
            }else{
                res.status(201).json({ id: result.insertId, name, email, address, phone});
            }
        }
    );
});

app.listen(3000, () =>{
    console.log('Servidor corriendo en : http://localhost:3000/user');
})