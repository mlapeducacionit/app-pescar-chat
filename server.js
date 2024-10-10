import { createServer } from 'node:http'
import path from 'node:path'
import express from 'express'
import 'dotenv/config'
import { Server } from 'socket.io'
// https://socket.io/docs/v4/server-api/
// ! Constantes/Variables
const app = express()
const PORT = process.env.PORT || 2222
// * Agrego la librería socket.io
const server = createServer(app)
const io = new Server(server) // genero el objeto io que tiene los métodos que nos van a permitir crear un servidor express con websocket
let clienteConectado = 0
const mensajes = [
    { usuario: 'Fulanito', mensaje: 'Hola! Qué tal!' },
    { usuario: 'Menganito', mensaje: 'Muy bien y vos?' },
    { usuario: 'Sultanito', mensaje: 'Genial!'}
]

// ! Middleware
console.log(path.join('public'))
app.use(express.static(path.join('public')))

// ! Socket.io
// addEventListenet('click', e => {})
// ! Detectamos conexiones
io.on('connection',  (socket) =>{
    clienteConectado++
    console.log('Un clientes se ha conectado', socket.id)
    console.log(clienteConectado)

    // ! Escuchar cuando alguien se desconecta 
    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id)
        clienteConectado--
        console.log(clienteConectado)
    })

    // ! Emito un mensaje
    // socket.emit('indentificador/key', 'value')
    socket.emit('nombre', 'Maximiliano')
    socket.emit('colores', ['rojo', 'verde', 'turquesa', 'violeta', 'rosa'])
    socket.emit('array-objetos', [{id: 1}, {id: 2}, {id: 3}, {id: 4}])

    // ? Emitimos los mensajes del CHAT
    socket.emit('mensajes', mensajes)

    // ! Escucho el mensaje que me envía el cliente

    socket.on('mensaje-cliente', (mensaje) => {
        console.log(mensaje)
    })

    // ? Estoy atento a los nuevos comentarios que me envíe el cliente

    socket.on('nuevo-comentario', data => {

        console.log(data)
        mensajes.push(data)
        io.sockets.emit('mensajes', mensajes)
    })


})



// ! Rutas
app.get('/', (req, res) => {
    res.send('OK')
})

// ! Arranque del servidor | -> No uso app, uso el server creado con la API de NODE
server.listen(PORT, (err) => {
    if (err) throw new Error(`No se pudo levantar el servidor -> ${err}`)
    console.log(`Aplicación arrancó -> http://localhost:${PORT}`)
})