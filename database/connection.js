//Configuración conexión base de datos

const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'hospital'
})

connection.connect(function (error) {
    if (error) {
        console.log(`Ocurrió un error en la conexion ${error}.`)
        return
    }
    else {
        console.log('Conexión exitosa.')
    }
})

module.exports = {connection}
