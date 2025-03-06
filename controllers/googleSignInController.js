const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')

const googleSignIn = asyncHandler(async (req, res)=>{
    const {username, email, profilePic} = req.body;
    if(!username || !email){
        return res.status(400).json({message: "Invalid email"});
    } 
    try{
        const duplicate = await User.findOne({ username, email }).collation({ locale: 'en', strength: 2 }).lean().exec()
        if(duplicate) {
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": duplicate.username,
                        "roles": duplicate.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            )
             
            const refreshToken = jwt.sign(
                { "username": duplicate.username }, 
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            )
            const user = {
                id: duplicate._id,
                username: duplicate.username,
                email: duplicate.email,
                roles: duplicate.roles,
            };
           return res.status(201).json({user, accessToken, refreshToken})
        }
        const userObject = { username, email }
        const newUser = await User.create(userObject);
        if(newUser)
        {    const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": newUser.username,
                    "roles": newUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
         
        const refreshToken = jwt.sign(
            { "username": newUser.username }, 
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
        const user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            roles: newUser.roles,
        };
        return res.status(201).json({user, accessToken, refreshToken})
        }else{
            return res.status(400).json({message: 'Invalid user data received'});
        }
    
    }catch(e){
       return res.status(500).json({'message': e.message});
    }
    })

module.exports = googleSignIn