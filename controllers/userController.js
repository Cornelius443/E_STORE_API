const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs') 
const cloudinary = require('../utils/cloudinary')

// get all users
// route Get /users
// @access private
const getAllUsers = asyncHandler(async (req, res)=>{
    try{
        const users = await User.find().select('-password').lean();
        if(!users?.length) return res.status(400).json({message: 'No users found'});
        res.json(users);
    }catch(e){
        res.status(500).json({'message': e.message});
    }
})

const getUser = asyncHandler(async (req, res)=>{
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized - No user found' });
    }
    const user = await User.findOne({ username: req.user }).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user, token: req.token });
})

// Create new user
// route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res)=>{
    const {username, email,  password, roles} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    } 
    try{
        // check for duplicate
        const duplicate = await User.findOne({ username, email }).collation({ locale: 'en', strength: 2 }).lean().exec()
        if(duplicate) return res.status(409).json({message: "Username and Email has been taken"});
        // hash password
        const hashPwd = await bcrypt.hash(password, 10); // salt rounds
     
        const userObject = (!Array.isArray(roles) || !roles.length)
        ? { username, "email": email, "password": hashPwd }
        : { username, "email": email, "password": hashPwd, roles }
        
        // create and store new user
        const user = await User.create(userObject);
        if(user){
            res.status(201).json({message: `New user ${username} created`});
        }else{
            res.status(400).json({message: 'Invalid user data received'});
        }

    }catch(e){
        res.status(500).json({'message': e.message});
    }
})

// Update a user
// route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res)=>{
    const {username, email,} = req.body;
    //confirm data
    if(!username || !email){
       return res.status(400).json({message: 'All fields are required'});
    }
    try{
       let user = await User.findOne({ username, email }).exec() 
       if(!user) return res.status(400).json({message: 'User not found'});
       user.username = username;
       user.email = email;
       const updatedUser = await user.save();
       res.json({message: `${updatedUser.username} updated`});
    }catch(e){
       res.status(500).json({'message': e.message});
    }
   })

   const updateProfilePic = asyncHandler(async (req, res)=>{
    if (!req.user) return res.status(401).json({ message: 'Unauthorized - No user found' });
    if (!req.file) return res.status(400).json({ message: 'Image required' });
    try{
       let user = await User.findOne({ username: req.user }).exec();
       if(!user) return res.status(400).json({message: 'User not found'});
       
           if (user.profilePic) {
            const publicId = user.profilePic.split('/').pop().split('.')[0]; 
            await cloudinary.uploader.destroy(`user_profiles/${publicId}`);
        }
       const imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles" },
            (error, uploadResult) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return reject(new Error("Cloudinary upload failed"));
                }
                resolve(uploadResult.secure_url);
            }
        );
        stream.end(req.file.buffer);
    });
  
    user.profilePic = imageUrl;
    const updatedUser = await user.save();
    res.json({ message: `${updatedUser.username} updated`, user: updatedUser });
    }catch(e){
        console.log(e)
       res.status(500).json({'message': e.message});
    }
   })


module.exports ={getAllUsers, createNewUser, getUser, updateUser, updateProfilePic}





