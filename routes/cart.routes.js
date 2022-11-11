const express = require("express");
const { Router } = express;
const router = Router();
const logger = require("../utils/logger");
/* ---------  ------------- */
router.get('/cart', async (req,res) =>{    
    try{
        logger.info('GET /cart' )
        let user = req.user
        res.status(200).render('cart', {user})
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
        logger.error(error)
    }
})
router.post('/cart', async (req,res) =>{    
    try{
        logger.info('POST /cart' )
        let user = req.user
        res.status(200).render('cart', {user})
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
        logger.error(error)
    }
})
router.get('/cart/:id', async (req,res) =>{    
    try{
        logger.info('GET /cart/:id' )
        let user = req.user
        res.status(200).render('cart', {user})
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
        logger.error(error)
    }
})


module.exports = router;