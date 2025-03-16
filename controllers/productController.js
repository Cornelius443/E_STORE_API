const cloudinary = require('../utils/cloudinary')
const asyncHandler = require('express-async-handler')
const Product = require('../models/Product')



const getAllProducts = asyncHandler(async(req, res) =>{
    try{
        const products = await Product.find().lean()
        if(!products?.length) return res.status(400).json({message: 'No products found'})
        res.status(200).json(products);
    }catch(e){
        res.status(500).json({'message': e.message})
    } 
})


const createNewProduct = asyncHandler(async(req, res)=>{
    try{
        const {name, brand, description, price, quantity, color, colors} = req.body
        if(!name || !brand || !description || !price || !quantity || !color){
            return res.status(400).json({message: "All fields are required"})
        }
            let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "productsImg" },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary Upload Error:", error);
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    );
                    uploadStream.end(file.buffer);
                });
            });
            
            imageUrls = await Promise.all(uploadPromises);
        }
        const productObj = { 
            name, 
            brand, 
            description, 
            price, 
            quantity, 
            color, 
            colors: Array.isArray(colors) && colors.length ? colors : undefined, 
            images: imageUrls.length ? imageUrls : undefined
        };
        const product = await Product.create(productObj)
        if (product) { 
            return res.status(201).json({ message: 'New product created' })
        } else {
            return res.status(400).json({ message: 'Invalid product data received' })
        }
    }catch(e){
        res.status(500).json({'message': e.message})
    }
})


module.exports = {getAllProducts, createNewProduct} 