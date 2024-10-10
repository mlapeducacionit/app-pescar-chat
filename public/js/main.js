console.log('Hola mundo!')
// https://socket.io/docs/v4/client-api/

const socket = io.connect()
// ! Escucho el mensaje que viene por el identificador mensaje
socket.on('nombre', (data) => {
    console.log(data)
})

// ! Escuchar el mensaje que venga por el identificador colores

socket.on('colores', (colores) => {
    console.log(colores)
})

// ! Escuchar el mensaje que venga por el identificador array-colores

socket.on('array-objetos', (array_colores) => {
    console.log(array_colores)
})

// ! Emito un mensaje desde el cliente.
const saludo = 'Hola desde el cliente'
socket.emit('mensaje-cliente', saludo)

function render(data) {
    console.log('Empiezo el proceso de render')
    console.log(data)

    let html = data.map(msj => {
        return (
            `
                <div>
                    <strong>${msj.usuario}</strong>
                    <em>${msj.mensaje}</em>
                </div>
            `
        )
    }).join(' ')
    console.log(html)
    document.querySelector('.mensajes').innerHTML = html
}

// ? Recibimos los mensajes del CHAT
socket.on('mensajes', data => {
    console.log(data)
    render(data)
})

function agregarMensaje(e) {
    e.preventDefault()

    const nombre = document.querySelector('#lbl-nombre') // input#lbl-nombre
    const mensaje = document.querySelector('#lbl-mensaje')

    const obj = {
        usuario: nombre.value,
        mensaje: mensaje.value
    }

    console.log(obj)

    // ? Envío del mensaje a través de websocket
    socket.emit('nuevo-comentario', obj)

    nombre.value = ''
    mensaje.value = ''

}

const form = document.querySelector('form')
console.log(form)
form.addEventListener('submit', agregarMensaje)






