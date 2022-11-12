const { productsDao, cartsDao } = require("../dao/index.dao");
const logger = require("../utils/logger");

const sumar = (arr) => {
    let total = 0
    for(let i = 0; i <= arr.length -1 ; i++){
        total +=arr[i]
    }
    return total
}

const carrito = async (socket, io ) => {
    try {
        let user = socket.request.session.passport.user
        const getCarrito = await cartsDao.getByEmail(user.userEmail)
        let carrito = getCarrito
        if(carrito){
            const carrito = getCarrito
            let arr = carrito.productos.map( prod => prod.price) 
            let total = sumar(arr)
            socket.emit('mensaje-servidor-carrito', carrito, total)
        }else{
            const carrito = await cartsDao.crearCarrito(user.userEmail)
            socket.emit('mensaje-servidor-carrito', carrito)
        }
        socket.on('agregar-producto', async (productId) => {
            let user = socket.request.session.passport.user
            let email = user.userEmail
            const producto = await productsDao.getById(productId)
            const carrito = await cartsDao.getByEmail(email)
            if(carrito){
                await cartsDao.pushProduct(email, producto)
                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }else{
                carrito = await cartsDao.crearCarrito(email)
                await cartsDao.pushProduct(email, producto)

                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }
        })

        socket.on('eliminar-producto', async (productId) => {
            console.log('aca');
            let user = socket.request.session.passport.user
            let email = user.userEmail
            const carrito = await cartsDao.getByEmail(email)
            if(carrito){
                await cartsDao.deleteProductInCart(email, productId)
                //await cartsDao.deleteProductById(email, productId)
                
                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }
        })

        socket.on('comprar-carrito', async () => {
            let user = socket.request.session.passport.user
            const carrito = await cartsDao.getByEmail(user.userEmail)
            if(carrito){
                const order = carrito.productos
                await sendNewOrder(order, user)
                await sendWhatsApp(order, user)
                await carrito.updateOne({ $set: { productos: [] } })
                io.sockets.emit('mensaje-servidor-carrito', carrito)
            }
        })

    } catch (error) {
        logger.error('Error en cart.socket', error)
    }
}

module.exports = carrito