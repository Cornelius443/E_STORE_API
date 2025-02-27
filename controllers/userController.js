const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs') 


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

module.exports ={getAllUsers, createNewUser, getUser}