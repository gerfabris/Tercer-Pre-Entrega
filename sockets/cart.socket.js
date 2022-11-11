const { productsDao, cartsDao } = require("../dao/index.dao");
const logger = require("../utils/logger");

const carrito = async (socket, io ) => {
    try {
        let user = req.user
        const getCarrito = await cartsDao.getByEmail(user.userEmail)
        if(carrito){
            const carrito = getCarrito
            socket.emit('mensaje-servidor-carrito', carrito)
        }else{
            const carrito = await cartsDao.crearCarrito(user.userEmail)
            socket.emit('mensaje-servidor-carrito', carrito)
        }

        socket.on('agregar-producto', async () => {
            const { productId } = req.body
            let email = req.user.userEmail
            const getProducto = await productsDao.getById(productId)
            const getCarrito = await cartsDao.getByEmail(email)
            const producto = getProducto
            const carrito = getCarrito
            if(carrito){
                const agregarProducto = await cartsDao.pushProduct(email, producto)
                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }else{
                carrito = await cartsDao.crearCarrito(email)
                const agregarProducto = await cartsDao.pushProduct(email, producto)

                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }
        })

        socket.on('eliminar-producto', async () => {
            const { id } = req.query
            let email = req.user.userEmail
            const getCarrito = await cartsDao.getByEmail(email)

            const carrito = getCarrito
            if(carrito){
                const eliminarProducto = await cartsDao.deleteProductInCart(email, id)
                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }
        })

        socket.on('comprar-carrito', async () => {
            let user = req.user
            const getCarrito = await cartsDao.getByEmail(user.userEmail)
            const carrito = getCarrito
            if(carrito){
                const order = carrito.productos
                await sendNewOrder(order, user)
                await sendWhatsApp(order, user)
                await carrito.updateOne({ $set: { productos: [] } })
                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }
        })

    } catch (error) {
        logger.error(error)
    }
}

module.exports = carrito