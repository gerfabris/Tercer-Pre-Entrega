const { createTransport } = require('nodemailer')
const logger = require('../utils/logger')
const dotenv = require('dotenv').config()

const MAIL = process.env.MAIL
const MAIL_PASSWORD = process.env.MAIL_PASSWORD

const sendEmailNewUser = async ( user ) =>{
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: MAIL,
            pass: MAIL_PASSWORD,
        },
    })
    
    const mailOptions = {
        from: 'Servidor',
        to: MAIL,
        subject: 'Nuevo Registro',
        text: `Se ha registrado un nuevo usuario: ${user.name} con el email: ${user.userEmail}`,
    }
    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info('Info mailOptions' , info)
    } catch (error) {
        logger.error('Error en mailOptions', error)
    }
}


module.exports = sendEmailNewUser