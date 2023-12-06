var express = require('express');
var router = express.Router();
const {connection} = require('../database/connection')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Enrutamiento visualización medicos registrados
router.get('/listado-medicos', (req, res) => {
  connection.query('SELECT * FROM medicos;', (error, resultado) => {
    if (error) {
      console.log('Ocurrió un error en la ejecución.', error)
      res.status(50).send('Error en la ejecución.')
    }
    else {
      res.status(200).render('medicos', {resultado})
    }
  })
})

//Enrutamiento visualización pacientes registrados
router.get('/listado-pacientes', (req, res) => {
  connection.query('SELECT * FROM pacientes;', (error, resultado) => {
    if (error) {
      console.log('Ocurrió un error en la ejecución.', error)
      res.status(50).send('Error en la ejecución.')
    }
    else {
      res.status(200).render('pacientes', {resultado})
    }
  })
})

//Enrutamiento visualización citas agendadas
router.get('/listado-citas', (req, res) => {
  connection.query('SELECT fecha_cita, pacientes.nombres, pacientes.apellidos, pacientes.telefono, medicos.especialidad, medicos.consultorio, medicos.nombres nombresMedico, medicos.apellidos apellidosMedico FROM cita_medica, pacientes, medicos WHERE cedula_medico=medicos.cedula AND cedula_paciente=pacientes.cedula;', (error, resultado) => {
    if (error) {
      console.log('Ocurrió un error en la ejecución.', error)
      res.status(500).send('Error en la ejecución.')
    }
    else {
      res.status(200).render('citas', {resultado})
    }
  })
})

//Enrutamiento registro médico
router.post('/agregar-medico', (req, res) => {
  const nombres = req.body.nombres
  const apellidos = req.body.apellidos
  const cedula = req.body.cedula
  const consultorio = req.body.consultorio
  const telefono = req.body.telefono
  const correo = req.body.correo
  const especialidad = req.body.especialidad

  connection.query(`INSERT INTO medicos (cedula, nombres, apellidos, especialidad, consultorio, correo, telefono) VALUES (${cedula}, '${nombres}', '${apellidos}', '${especialidad}', '${consultorio}', '${correo}', '${telefono}')`, (error, resultado) => {
    if (error) {
      console.log(error)
      res.status(500).send('Ocurrió un error en la consulta.')
    }
    else {
      res.status(200).redirect('/listado-medicos')
    }
  })
})

//Enrutamiento registro paciente
router.post('/agregar-paciente', (req, res) => {
  const nombres = req.body.nombres
  const apellidos = req.body.apellidos
  const cedula = req.body.cedula
  const fecha_nacimiento = req.body.fecha_nacimiento
  const telefono = req.body.telefono

  connection.query(`INSERT INTO pacientes (cedula, nombres, apellidos, fecha_nacimiento, telefono) VALUES (${cedula}, '${nombres}', '${apellidos}', '${fecha_nacimiento}', '${telefono}')`, (error, resultado) => {
    if (error) {
      console.log(error)
      res.status(500).send('Ocurrió un error en la consulta.')
    }
    else {
      res.status(200).redirect('/listado-pacientes')
    }
  })
})

//Enrutamiento visualización especialidad y agendamiento con médico
router.post('/consulta-cita', (req, res) => {
  const especialidad = req.body.especialidad

  connection.query(`SELECT * FROM medicos WHERE especialidad='${especialidad}';`, (error, resultado) => {
    if (error) {
      console.log(error)
      res.status(500).send('Ocurrió un error en la consulta.')
    }
    else {
      res.status(200).render('agendar-citas', {resultado})
    }
  })
})

//Enrutamiento agendamiento cita
router.post('/agregar-cita', (req, res) => {
  const cedula_paciente = req.body.cedula
  const fecha_cita = req.body.fecha_cita
  const cedula_medico = req.body.medico

  connection.query(`INSERT INTO cita_medica (cedula_medico, cedula_paciente, fecha_cita) VALUES (${cedula_medico}, ${cedula_paciente}, '${fecha_cita}');`, (error, resultado) => {
    if (error) {
      console.log(error)
      res.status(500).send('Ocurrió un error en la consulta.')
    }
    else {
      res.status(200).redirect('/listado-citas')
    }
  })
})

module.exports = router;
