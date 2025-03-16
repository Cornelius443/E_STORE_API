const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJwt')
const productController = require('../controllers/productController')
const upload = require('../middleware/multer') 




router.get('/', verifyJWT, productController.getAllProducts)


router.post('/',upload.array('productPics', 3), productController.createNewProduct)


module.exports = router;