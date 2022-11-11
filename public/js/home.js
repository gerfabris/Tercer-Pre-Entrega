const server = io().connect()

const renderProductos = productos => {
    let listado = document.getElementById('list')        
    fetch('../views/partials/cardsProductos.hbs')
        .then((res) => res.text())
        .then((data) =>{
            const template = Handlebars.compile(data)
            const html = template({
                productos: productos
            })
            listado.innerHTML = html 
    })
}

const agregarProducto = () => {
    server.emit('agregar-producto', (id) =>{
        console.log(id);
    })
}


/* ---- server escucha mensaje para insertar productos ------- */
server.on('mensaje-servidor-productos-home', ( productos ) =>{
    renderProductos (productos)
})



